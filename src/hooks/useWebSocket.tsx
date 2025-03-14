import { useState, useEffect, useCallback, useRef } from 'react';
import { BotMsg, BotMessageTypes, BotRequestMsg } from '../types/protocol';

export function useWebSocket(uri: string, reconnectTrigger = 0) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const isAttemptingConnection = useRef(false);
  
  // Check if we can connect to the WebSocket server
  useEffect(() => {
    if (!uri) return;
    
    const checkConnection = async () => {
      if (isAttemptingConnection.current) return;
      
      isAttemptingConnection.current = true;
      console.log(`Checking connection to WebSocket at ${uri}`);
      
      try {
        const socket = new WebSocket(uri);
        
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
  }, [uri, reconnectTrigger]);

  // Send message function - creates a new connection for each message
  const sendMessage = useCallback((
    message: string, 
    userId: string | null, 
    onReceiveMessage: (message: BotMsg) => void,
    onSendMessage?: (request: BotRequestMsg) => void
  ) => {
    if (!uri) return;
    
    console.log(`Creating new connection to send message: ${message}`);
    
    // Create the request object
    const botRequest: BotRequestMsg = {
      type: BotMessageTypes.REQUEST,
      data: {
        user_id: userId,
        human: message
      }
    };
    
    // Call the callback to let parent component handle adding this message
    if (onSendMessage) {
      onSendMessage(botRequest);
    }
    
    // Create a new WebSocket connection for this message
    const socket = new WebSocket(uri);
    socketRef.current = socket;
    
    socket.onopen = () => {
      console.log('WebSocket opened for sending message');
      // Send the message as soon as the connection opens
      socket.send(JSON.stringify(botRequest));
      console.log('Sent message:', botRequest);
    };
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as BotMsg;
      console.log('Received message:', message);
      onReceiveMessage(message);
      
      // If this is a final response, close the connection
      if (message.type === BotMessageTypes.RESPONSE) {
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
  }, [uri]);

  return { isConnected, sendMessage };
}