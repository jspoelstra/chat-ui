import React, { useEffect, useRef } from 'react';
import { BotMsg } from '../types/protocol';
import MessageDisplay from './MessageDisplay';
import './ChatContainer.css';

interface ChatContainerProps {
  messages: BotMsg[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <MessageDisplay key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;