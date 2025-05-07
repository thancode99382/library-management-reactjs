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
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
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
      {
        id: 2,
        name: 'Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        lastMessage: 'I\'ll check the availability of that book',
        time: 'Yesterday',
        unread: 0,
        online: true,
        messages: [
          { id: 1, text: 'Do you have "The Great Gatsby" available?', sent: false, time: 'Yesterday, 2:30 PM' },
          { id: 2, text: 'Let me check our inventory', sent: true, time: 'Yesterday, 2:32 PM' },
          { id: 3, text: 'I\'ll check the availability of that book', sent: true, time: 'Yesterday, 2:33 PM' },
        ]
      },
      {
        id: 3,
        name: 'Robert Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        lastMessage: 'Thanks for the recommendation!',
        time: 'Yesterday',
        unread: 0,
        online: false,
        messages: [
          { id: 1, text: 'Can you recommend some good sci-fi books?', sent: false, time: 'Yesterday, 11:20 AM' },
          { id: 2, text: 'Sure! "Dune" by Frank Herbert is a classic', sent: true, time: 'Yesterday, 11:25 AM' },
          { id: 3, text: 'Also "Neuromancer" by William Gibson', sent: true, time: 'Yesterday, 11:26 AM' },
          { id: 4, text: 'Thanks for the recommendation!', sent: false, time: 'Yesterday, 11:30 AM' },
        ]
      },
      {
        id: 4,
        name: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        lastMessage: 'I\'d like to reserve a study room for tomorrow',
        time: 'Monday',
        unread: 1,
        online: false,
        messages: [
          { id: 1, text: 'Hello, is it possible to reserve study rooms?', sent: false, time: 'Monday, 3:15 PM' },
          { id: 2, text: 'Yes, we have 5 study rooms available for members', sent: true, time: 'Monday, 3:20 PM' },
          { id: 3, text: 'I\'d like to reserve a study room for tomorrow', sent: false, time: 'Monday, 3:25 PM' },
        ]
      },
      {
        id: 5,
        name: 'Michael Brown',
        avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
        lastMessage: 'When will the new science magazines arrive?',
        time: 'Monday',
        unread: 0,
        online: true,
        messages: [
          { id: 1, text: 'Do you carry science magazines?', sent: false, time: 'Monday, 10:05 AM' },
          { id: 2, text: 'Yes, we have National Geographic, Scientific American, and more', sent: true, time: 'Monday, 10:10 AM' },
          { id: 3, text: 'When will the new science magazines arrive?', sent: false, time: 'Monday, 10:15 AM' },
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
      <ConversationList 
        conversations={conversations}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
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