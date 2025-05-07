import { FaSearch } from 'react-icons/fa';

export const ConversationList = ({ 
  conversations, 
  activeConversation, 
  setActiveConversation, 
  searchTerm, 
  setSearchTerm 
}) => {
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-100 border-r border-gray-200 flex flex-col bg-gray-50">
      {/* Search and filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-greenlove focus:border-greenlove"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map(conv => (
            <ConversationItem 
              key={conv.id} 
              conversation={conv} 
              isActive={activeConversation?.id === conv.id}
              onClick={() => setActiveConversation(conv)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No conversations found</div>
        )}
      </div>
    </div>
  );
};

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const { name, avatar, lastMessage, time, unread, online } = conversation;
  
  return (
    <div 
      className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={avatar} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        {online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          {unread > 0 && (
            <span className="bg-greenlove text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};