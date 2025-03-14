import { useState, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import DebugPanel from './components/DebugPanel';
import SettingsPanel from './components/SettingsPanel';
import { BotSystemMsg, BotMessageTypes, BotMsg, BotRequestMsg } from './types/protocol';
import './App.css';

function App() {
  // Changed from ws://localhost:501/chat to ws://localhost:501
  // The hook will append the correct endpoint (/chat or /system)
  const [wsUri, setWsUri] = useState('ws://localhost:501');
  const [userId, setUserId] = useState<string | null>("anonymous");
  const [showSettings, setShowSettings] = useState(false);
  const [reconnectTrigger, setReconnectTrigger] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<BotMsg[]>([]);
  const { isConnected, sendMessage } = useWebSocket(wsUri, reconnectTrigger);

  // Callback for when a message is received from the server
  const handleReceiveMessage = useCallback((message: BotMsg) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Callback for when a message is sent to add it to the UI
  const handleSendMessage = useCallback((message: string) => {
    setIsSending(true);
    
    sendMessage(
      message, 
      userId, 
      handleReceiveMessage, 
      (request: BotRequestMsg) => {
        setMessages(prev => [...prev, request]);
      }
    );
    
    setTimeout(() => setIsSending(false), 1000);
  }, [userId, sendMessage, handleReceiveMessage]);

  const handleRetryConnection = useCallback(() => {
    setReconnectTrigger(prev => prev + 1);
  }, []);

  const handleNewConversation = useCallback(() => {
    const systemMsg: BotSystemMsg = {
      type: BotMessageTypes.SYSTEM,
      data: {
        user_id: userId,
        cmd: 'end_conversation',
        args: []
      }
    };
    
    // Send system message and clear messages
    // The hook will detect that this is a system message and use the /system endpoint
    sendMessage(
      JSON.stringify(systemMsg), 
      userId, 
      handleReceiveMessage
    );
    
    setMessages([]);
  }, [userId, sendMessage, handleReceiveMessage]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Frisbee UI</h1>
        <div className="connection-status">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
          {!isConnected && (
            <button 
              onClick={handleRetryConnection}
              className="retry-button"
              style={{ marginLeft: '10px' }}
            >
              Retry Connection
            </button>
          )}
        </div>
        <button onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
        <button onClick={handleNewConversation} style={{ marginLeft: '10px' }}>
          New Conversation
        </button>
      </header>

      {showSettings && (
        <SettingsPanel 
          wsUri={wsUri} 
          setWsUri={(uri) => {
            setWsUri(uri);
            handleRetryConnection();
          }} 
          userId={userId} 
          setUserId={setUserId} 
        />
      )}

      <div className="main-content">
        <div className="chat-section">
          <ChatContainer messages={messages} />
          <MessageInput 
            onSendMessage={handleSendMessage} 
            disabled={!isConnected || isSending} 
          />
        </div>
        <DebugPanel messages={messages} />
      </div>
    </div>
  );
}

export default App;
