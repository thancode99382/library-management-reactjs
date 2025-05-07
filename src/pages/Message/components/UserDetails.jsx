import { FaPhone, FaVideo, FaEllipsisV } from 'react-icons/fa';

export const UserDetails = ({ conversation }) => {
  if (!conversation) return null;
  
  const { name, avatar, online } = conversation;
  
  return (
    <div className="hidden lg:block w-72 border-l border-gray-200 bg-white">
      {/* <div className="p-6 text-center">
        <img 
          src={avatar} 
          alt={name} 
          className="w-24 h-24 rounded-full object-cover mx-auto"
        />
        <h3 className="font-medium text-xl text-gray-900 mt-4">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {online ? 'Online' : 'Last seen today'}
        </p>
        
        <div className="flex justify-center space-x-4 mt-6">
          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <FaPhone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <FaVideo className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <FaEllipsisV className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6 text-left">
          <h4 className="text-sm font-medium text-gray-900 mb-2">User Information</h4>
          <div className="space-y-2">
            <p className="text-sm"><span className="text-gray-500">Email:</span> {name.toLowerCase().replace(' ', '.')}@example.com</p>
            <p className="text-sm"><span className="text-gray-500">Member since:</span> Jan 2023</p>
            <p className="text-sm"><span className="text-gray-500">Books borrowed:</span> 12</p>
            <p className="text-sm"><span className="text-gray-500">Status:</span> Active member</p>
          </div>
          
          <h4 className="text-sm font-medium text-gray-900 mt-6 mb-2">Recent Books</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-10 h-14 bg-gray-200 rounded"></div>
              <div className="ml-3">
                <p className="text-xs font-medium">The Great Gatsby</p>
                <p className="text-xs text-gray-500">Due: May 15</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-14 bg-gray-200 rounded"></div>
              <div className="ml-3">
                <p className="text-xs font-medium">To Kill a Mockingbird</p>
                <p className="text-xs text-gray-500">Returned: Apr 28</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};