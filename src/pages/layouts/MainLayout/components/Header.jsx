import { useState, useEffect } from "react";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { getCurrentUser } from "../../../../components/utils/auth";

const Header = ({ toggleSidebar, sidebarOpen, isMobile }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({ fullname: '', email: '' });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserInfo({
        fullname: user.fullname || 'User',
        email: user.email || 'user@example.com'
      });
    }
    
    // Mock notifications - in a real app, you would fetch these from an API
    setNotifications([
      { id: 1, message: 'New book added to library', time: '10m ago', read: false },
      { id: 2, message: 'Overdue reminder: "Design Patterns"', time: '1h ago', read: false },
      { id: 3, message: 'System maintenance scheduled', time: '2h ago', read: true },
    ]);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Mobile hamburger button */}
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-greenlove focus:outline-none focus:text-greenlove lg:hidden"
            >
              <FaBars size={20} />
            </button>
            
            {/* Search */}
            {/* <div className="relative ml-4 lg:ml-0">
              <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 max-w-xs">
                <FaSearch className="h-4 w-4 text-gray-400" />
                <input
                  className="ml-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-700 placeholder-gray-400 w-full"
                  type="text"
                  placeholder="Search..."
                />
              </div>
            </div> */}
          </div>
          
          <div className="flex items-center space-x-3">
            
            

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-greenlove text-white flex items-center justify-center">
                  <span className="text-sm font-medium">{getInitials(userInfo.fullname)}</span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {userInfo.fullname}
                </span>
              </button>

              {/* User dropdown panel */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="none">
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <span className="mr-2">👤</span> Profile
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <span className="mr-2">⚙️</span> Settings
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <a
                      href="/login"
                      className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <span className="mr-2">🚪</span> Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;