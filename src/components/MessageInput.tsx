import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        disabled={disabled}
        className="message-input"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button 
        type="submit" 
        disabled={disabled || !message.trim()}
        className="send-button"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;