import { useState, useEffect, useRef } from 'react';
import { FaPhone, FaVideo, FaInfo, FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';
import { ChatHeader } from './ChatHeader';
import { MessagesList } from './MessagesList';
import { io } from 'socket.io-client';
import { marked } from 'marked';

export const ChatArea = ({ 
  activeConversation,
  message,
  setMessage,
  handleSendMessage 
}) => {
  const [messages, setMessages] = useState(activeConversation?.messages || []);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  
  // Initialize Socket.io connection and marked parser
  useEffect(() => {
    // Setup markdown parser options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    
    // Initialize Socket connection to NestJS server on port 3000
    socketRef.current = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true, // Include cookies if needed for authentication
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    // Request chat history when connecting
    socketRef.current.on('connect', () => {
      console.log('Connected to NestJS socket server');
      socketRef.current.emit('getHistory');
    });

    // Listen for connection errors
    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for chat history
    socketRef.current.on('chatHistory', (messages) => {
      // Convert message format to match our app's format
      const formattedMessages = messages.map(msg => ({
        id: msg.id || Math.random().toString(36).substr(2, 9),
        text: msg.message,
        // FIX: Keep consistent with how we create messages when sending
        // User messages should have sent=true, bot messages should have sent=false
        sent: !msg.isBot, 
        time: formatTime(new Date(msg.createdAt)),
      }));
      
      setMessages(prev => {
        // Keep the welcome message if it exists
        const welcomeMessage = prev.length > 0 ? [prev[0]] : [];
        return [...welcomeMessage, ...formattedMessages];
      });
    });
    
    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      setIsTyping(false);
      
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        text: message.text,
        // FIX: Keep consistent with the logic in chatHistory
        sent: !message.isBot,
        time: formatTime(new Date(message.createdAt)),
      };
      
      setMessages(prev => [...prev, newMessage]);
    });
    
    // Clean up socket connection when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  // Update local messages when activeConversation changes
  useEffect(() => {
    if (activeConversation?.messages) {
      setMessages(activeConversation.messages);
    }
  }, [activeConversation]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  // Format time helper function
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Scroll to bottom of chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  
  // Modified handleSendMessage function that works with Socket.io
  const handleSocketSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat immediately for better UX
    const newMessage = {
      id: messages.length + 1,
      text: message,
      // FIX: User messages should have sent=true for consistent display
      sent: true,  
      time: formatTime(new Date())
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Send message to server
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', message);
    }
    
    // Clear input
    setMessage('');
  };
  
  if (!activeConversation) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader conversation={activeConversation} />
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        <MessagesList 
          messages={messages} 
          isTyping={isTyping} 
          parseMarkdown={text => marked.parse(text)} 
        />
      </div>
      <MessageInput 
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSocketSendMessage}
      />
    </div>
  );
};

const MessageInput = ({ message, setMessage, handleSendMessage }) => {
  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  return (
    <form onSubmit={handleSendMessage} className="p-4 flex items-center">
      <button type="button" className="p-2 text-gray-500 hover:text-greenlove">
        <FaPaperclip className="w-5 h-5" />
      </button>
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-greenlove focus:border-greenlove mx-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
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