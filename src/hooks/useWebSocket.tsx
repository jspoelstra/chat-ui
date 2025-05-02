import { useState, useEffect, useCallback, useRef } from 'react';
import { BotMsg, BotMessageTypes, BotRequestMsg, BotSystemMsg } from '../types/protocol';

// Helper function to construct WebSocket URIs
function constructWebSocketUri(baseUri: string, endpoint: string): string {
  try {
    const url = new URL(baseUri);
    // Ensure endpoint starts with a slash
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${url.protocol}//${url.host}${formattedEndpoint}`;
  } catch {
    console.error('Invalid WebSocket URI:', baseUri);
    // Fallback to simple string concatenation
    const separator = baseUri.endsWith('/') ? '' : '/';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${baseUri}${separator}${cleanEndpoint}`;
  }
}

export function useWebSocket(baseUri: string, reconnectTrigger = 0) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const isAttemptingConnection = useRef(false);
  
  // Check if we can connect to the WebSocket server
  useEffect(() => {
    if (!baseUri) return;
    
    const checkConnection = async () => {
      if (isAttemptingConnection.current) return;
      
      isAttemptingConnection.current = true;
      const chatUri = constructWebSocketUri(baseUri, '/chat');
      console.log(`Checking connection to WebSocket at ${chatUri}`);
      
      try {
        const socket = new WebSocket(chatUri);
        
        // Set up event handlers
        socket.onopen = () => {
          console.log('Connection check successful');
          setIsConnected(true);
          socket.close(); // Close after connection check
        };
        
        socket.onerror = () => {
          console.error('Connection check failed');
          setIsConnected(false);
        };
        
        socket.onclose = () => {
          isAttemptingConnection.current = false;
        };
      } catch (error) {
        console.error('WebSocket connection check error:', error);
        setIsConnected(false);
        isAttemptingConnection.current = false;
      }
    };
    
    checkConnection();
    
    return () => {
      isAttemptingConnection.current = false;
    };
  }, [baseUri, reconnectTrigger]);

  // Send message function - creates a new connection for each message
  const sendMessage = useCallback((
    message: string, 
    userId: string | null, 
    onReceiveMessage: (message: BotMsg) => void,
    onSendMessage?: (request: BotRequestMsg) => void
  ) => {
    if (!baseUri) return;
    
    // Determine message type and endpoint
    let messageObj: BotMsg;
    let endpoint: string;
    
    try {
      // Check if the message is a JSON string (system message)
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === BotMessageTypes.SYSTEM) {
        messageObj = parsedMessage as BotSystemMsg;
        endpoint = '/system';
      } else {
        // If JSON but not a system message, treat as chat
        messageObj = {
          type: BotMessageTypes.REQUEST,
          data: {
            user_id: userId,
            human: message
          }
        } as BotRequestMsg;
        endpoint = '/chat';
      }
    } catch {
      // Not JSON, treat as a normal chat message
      messageObj = {
        type: BotMessageTypes.REQUEST,
        data: {
          user_id: userId,
          human: message
        }
      } as BotRequestMsg;
      endpoint = '/chat';
    }
    
    console.log(`Creating new connection to send message to ${endpoint}: ${message}`);
    
    // Call the callback to let parent component handle adding this message
    if (onSendMessage && messageObj.type === BotMessageTypes.REQUEST) {
      onSendMessage(messageObj as BotRequestMsg);
    }
    
    // Create a new WebSocket connection for this message
    const uri = constructWebSocketUri(baseUri, endpoint);
    const socket = new WebSocket(uri);
    socketRef.current = socket;
    
    socket.onopen = () => {
      console.log(`WebSocket opened for sending message to ${endpoint}`);
      // Send the message as soon as the connection opens
      socket.send(JSON.stringify(messageObj));
      console.log('Sent message:', messageObj);
    };
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as BotMsg;
      console.log('Received message:', message);
      onReceiveMessage(message);
      
      // If this is a final response, close the connection
      if (message.type === BotMessageTypes.RESPONSE || 
          message.type === BotMessageTypes.SYSRESPONSE) {
        socket.close();
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error during message exchange:', error);
      setIsConnected(false);
    };
    
    socket.onclose = () => {
      console.log('WebSocket closed after message exchange');
      socketRef.current = null;
    };
    
    // Set a timeout to close the connection if no response is received
    const timeout = setTimeout(() => {
      if (socket.readyState !== WebSocket.CLOSED && socket.readyState !== WebSocket.CLOSING) {
        console.warn('Closing WebSocket due to timeout');
        socket.close();
      }
    }, 30000); // 30 seconds timeout
    
    // Clear timeout if component unmounts
    return () => clearTimeout(timeout);
  }, [baseUri]);

  return { isConnected, sendMessage };
}