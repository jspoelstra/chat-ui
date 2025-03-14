import React from 'react';
import { BotMsg, BotMessageTypes } from '../types/protocol';
import MessageDisplay from './MessageDisplay';
import './ChatContainer.css';

interface ChatContainerProps {
  messages: BotMsg[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <MessageDisplay key={index} message={message} />
      ))}
    </div>
  );
};

export default ChatContainer;