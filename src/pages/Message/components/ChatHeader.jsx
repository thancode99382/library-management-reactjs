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
          
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{name}</h3>
          
        </div>
      </div>
      <div className="flex items-center space-x-3">
        
      </div>
    </div>
  );
};