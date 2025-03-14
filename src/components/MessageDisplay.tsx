import ReactMarkdown from 'react-markdown';
import { BotMsg, BotMessageTypes } from '../types/protocol';

interface MessageDisplayProps {
  message: BotMsg;
}

function MessageDisplay({ message }: MessageDisplayProps) {
  const renderMessage = () => {
    switch (message.type) {
      case BotMessageTypes.REQUEST:
        return (
          <div className="user-message">
            <div className="message-sender">You</div>
            <div className="message-content">{message.data.human}</div>
          </div>
        );
      
      case BotMessageTypes.RESPONSE:
        return (
          <div className="bot-message">
            <div className="message-sender">AI</div>
            <div className="message-content">
              <ReactMarkdown>{message.data.bot_text}</ReactMarkdown>
            </div>
            {message.data.bot_thoughts && (
              <div className="message-thoughts">
                <details>
                  <summary>Thoughts</summary>
                  <ReactMarkdown>{message.data.bot_thoughts}</ReactMarkdown>
                </details>
              </div>
            )}
            {message.data.error && (
              <div className="message-error">Error: {message.data.error_message}</div>
            )}
          </div>
        );
      
      case BotMessageTypes.PROGRESS:
        return (
          <div className="bot-progress">
            <div className="message-thoughts">
              <ReactMarkdown>{message.data.bot_thoughts}</ReactMarkdown>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return <div className="message">{renderMessage()}</div>;
}

export default MessageDisplay;