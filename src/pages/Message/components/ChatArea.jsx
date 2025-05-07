import { FaPhone, FaVideo, FaInfo, FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';
import { ChatHeader } from './ChatHeader';
import { MessagesList } from './MessagesList';

export const ChatArea = ({ 
  activeConversation,
  message,
  setMessage,
  handleSendMessage 
}) => {
  if (!activeConversation) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader conversation={activeConversation} />
      <MessagesList messages={activeConversation.messages} />
      <MessageInput 
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

const MessageInput = ({ message, setMessage, handleSendMessage }) => {
  return (
    <form onSubmit={handleSendMessage} className="p-4  flex items-center">
      <button type="button" className="p-2 text-gray-500 hover:text-greenlove">
        <FaPaperclip className="w-5 h-5" />
      </button>
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-greenlove focus:border-greenlove mx-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="button" className="p-2 text-gray-500 hover:text-greenlove">
        <FaSmile className="w-5 h-5" />
      </button>
      <button 
        type="submit" 
        disabled={!message.trim()} 
        className={`ml-2 p-2 rounded-full ${message.trim() ? 'bg-greenlove text-white' : 'bg-gray-200 text-gray-500'}`}
      >
        <FaPaperPlane className="w-5 h-5" />
      </button>
    </form>
  );
};

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaInfo className="text-gray-400" />
      </div>
      <h3 className="text-xl text-gray-700">Select a conversation</h3>
      <p className="text-gray-500 mt-1">Choose from your existing conversations or start a new one</p>
    </div>
  </div>
);