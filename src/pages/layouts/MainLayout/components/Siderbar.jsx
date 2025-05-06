import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { MdClose, MdMenuOpen } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { routerList } from "../../../../constants";
import { getCurrentUser, logout } from "../../../../components/utils/auth";

const Sidebar = ({ isOpen, isMobile, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({ fullname: '', email: '' });
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserInfo({
        fullname: user.fullname || 'User',
        email: user.email || 'user@example.com'
      });
    }
    
    // Set active menu item based on current path
    const path = location.pathname;
    const activeRoute = routerList.find(route => route.href === path);
    if (activeRoute) {
      setActiveItem(activeRoute.href);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Animation variants for sidebar items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} 
          flex flex-col flex-shrink-0 
          ${isOpen ? (isMobile ? 'w-64' : 'w-64') : 'w-20'} 
          transition-all duration-300 ease-in-out
          bg-white border-r border-gray-200 shadow-sm
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-greenlove text-white">
          <div className={`flex items-center overflow-hidden ${!isOpen && 'w-0'}`}>
            <div className="flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L4 8L16 14L28 8L16 2Z" fill="currentColor" />
                <path d="M4 16L16 22L28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 24L16 30L28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={`ml-2 font-bold text-lg transition-all duration-300 ${!isOpen && 'opacity-0'}`}>
              LibraryApp
            </div>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-white"
          >
            {isMobile && isOpen ? (
              <MdClose size={24} />
            ) : (
              <MdMenuOpen 
                size={24}
                className={`transform transition-transform duration-300 ${!isOpen && 'rotate-180'}`}
              />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-3 space-y-1">
            <AnimatePresence>
              {routerList.map((item, index) => (
                <motion.div
                  key={item.href}
                  custom={index}
                  initial="hidden"
                  animate="show"
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => `
                      group relative flex items-center px-3 py-3 text-sm font-medium rounded-md mb-1
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-greenlove text-white' 
                        : 'text-gray-700 hover:bg-greenlove hover:bg-opacity-10'
                      }
                    `}
                  >
                    <span className="flex items-center justify-center w-6 h-6 mr-3">
                      {item.icon}
                    </span>
                    
                    <span className={`truncate transition-all duration-300 ${!isOpen && 'opacity-0 w-0'}`}>
                      {item.title}
                    </span>
                    
                    {/* Tooltip when sidebar is collapsed */}
                    {!isOpen && (
                      <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-sm
                                    invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                                    transition-all duration-300 z-50 whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                    
                    {/* Active indicator line */}
                    <span 
                      className={`absolute top-0 bottom-0 left-0 w-1 rounded-tr-md rounded-br-md bg-greenlove_2
                      ${activeItem === item.href ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </NavLink>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
        </div>

        {/* User Profile & Logout Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="bg-greenlove text-white p-1.5 rounded-full">
                <FaRegUser size={18} />
              </div>
            </div>
            
            <div className={`ml-3 transition-all duration-300 ${!isOpen && 'opacity-0 w-0 overflow-hidden'}`}>
              <p className="text-sm font-medium text-gray-700">
                {userInfo.fullname}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userInfo.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md
              hover:bg-red-50 transition-colors duration-200
              ${!isOpen && 'justify-center'}
            `}
          >
            <ImExit size={isOpen ? 16 : 20} className="flex-shrink-0" />
            <span className={`ml-2 truncate transition-all duration-300 ${!isOpen && 'opacity-0 w-0 overflow-hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
