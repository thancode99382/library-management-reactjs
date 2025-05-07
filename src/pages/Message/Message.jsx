import { useState, useEffect } from 'react';
import { ConversationList } from './components/ConversationList';
import { ChatArea } from './components/ChatArea';
import { UserDetails } from './components/UserDetails';

export const Message = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for conversations
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        name: 'Datkes AI',
        avatar: 'https://i.pinimg.com/736x/9a/d3/b6/9ad3b6ba79c242f7ce03120d1dc05893.jpg',
        lastMessage: 'Hey, have you checked the new book arrivals?',
        time: '10:30 AM',
        unread: 2,
        online: true,
        messages: [
          { id: 1, text: 'Hello there!', sent: false, time: '10:15 AM' },
          { id: 2, text: 'Hi! How can I help you today?', sent: true, time: '10:16 AM' },
          { id: 3, text: 'I was wondering about the book return policy', sent: false, time: '10:20 AM' },
          { id: 4, text: 'Our standard policy is 14 days for regular members', sent: true, time: '10:22 AM' },
          { id: 5, text: 'Premium members get 30 days', sent: true, time: '10:22 AM' },
          { id: 6, text: 'That\'s great to know, thanks!', sent: false, time: '10:25 AM' },
          { id: 7, text: 'Hey, have you checked the new book arrivals?', sent: false, time: '10:30 AM' },
        ]
      },
      
    ];
    
    setConversations(mockConversations);
    setActiveConversation(mockConversations[0]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const newMessage = {
      id: activeConversation.messages.length + 1,
      text: message,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastMessage: message,
      time: 'Just now'
    };
    
    setActiveConversation(updatedConversation);
    
    setConversations(conversations.map(conv => 
      conv.id === updatedConversation.id ? updatedConversation : conv
    ));
    
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] rounded-lg overflow-hidden  ">
      
      
      <ChatArea 
        activeConversation={activeConversation}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
      />
      
      {/* <UserDetails conversation={activeConversation} /> */}
    </div>
  );
};