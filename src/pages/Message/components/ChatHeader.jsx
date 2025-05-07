import { FaPhone, FaVideo, FaInfo } from 'react-icons/fa';

export const ChatHeader = ({ conversation }) => {
  const { name, avatar, online } = conversation;
  
  return (
    <div className="flex items-center justify-between p-4 ">
      <div className="flex items-center">
        <div className="relative">
          <img 
            src={avatar} 
            alt={name} 
            className="w-10 h-10 rounded-full object-cover"
          />
          {online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-xs text-gray-500">
            {online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        
      </div>
    </div>
  );
};