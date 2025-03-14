import { useState, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import DebugPanel from './components/DebugPanel';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function App() {
  const [wsUri, setWsUri] = useState('ws://localhost:501/chat');
  const [userId, setUserId] = useState<string | null>("anonymous");
  const [showSettings, setShowSettings] = useState(false);
  const [reconnectTrigger, setReconnectTrigger] = useState(0);
  const [isSending, setIsSending] = useState(false);
  
  const { isConnected, messages, sendMessage } = useWebSocket(wsUri, reconnectTrigger);

  const handleSendMessage = useCallback((message: string) => {
    setIsSending(true);
    sendMessage(message, userId);
    
    // Reset sending state after a short delay
    // This gives visual feedback to the user
    setTimeout(() => setIsSending(false), 1000);
  }, [userId, sendMessage]);

  const handleRetryConnection = useCallback(() => {
    // Increment the reconnect trigger to force a new connection check
    setReconnectTrigger(prev => prev + 1);
  }, []);

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
      </header>

      {showSettings && (
        <SettingsPanel 
          wsUri={wsUri} 
          setWsUri={(uri) => {
            setWsUri(uri);
            // Force reconnection when URI is updated
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
