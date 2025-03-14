import React from 'react';
import { BotMsg, BotMessageTypes } from '../types/protocol';
import ReactMarkdown from 'react-markdown';
import './DebugPanel.css';

interface DebugPanelProps {
  messages: BotMsg[];
}

const DebugPanel: React.FC<DebugPanelProps> = ({ messages }) => {
  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>Debug Panel</h3>
      </div>
      <div className="debug-content">
        {messages.map((message, index) => {
          if (message.type === BotMessageTypes.PROGRESS) {
            // For progress messages, show tool usage
            return (
              <div key={index} className="debug-message tool-call">
                <div className="message-sender">Tool Call: {message.data.tool}</div>
                <div className="tool-input">
                  <strong>Input:</strong>
                  <pre>{JSON.stringify(message.data.tool_input, null, 2)}</pre>
                </div>
                <div className="tool-output">
                  <strong>Output:</strong>
                  <pre>{message.data.tool_output}</pre>
                </div>
                {message.data.bot_thoughts && (
                  <div className="message-thoughts">
                    <strong>Thinking:</strong>
                    <ReactMarkdown>{message.data.bot_thoughts}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          } else if (message.type === BotMessageTypes.RESPONSE && message.data.bot_thoughts) {
            // Show thoughts from response messages
            return (
              <div key={index} className="debug-message">
                <div className="message-sender">AI Thoughts</div>
                <div className="message-thoughts">
                  <ReactMarkdown>{message.data.bot_thoughts}</ReactMarkdown>
                </div>
              </div>
            );
          }
          return null; // Skip other message types
        })}
      </div>
    </div>
  );
};

export default DebugPanel;