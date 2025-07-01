
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, BellRing, MessageSquare } from 'lucide-react';
import { User } from '../../types/auth';

interface HeaderProps {
  currentUser: User;
  isMobile: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  isMobile, 
  onToggleSidebar, 
  onLogout 
}) => {
  return (
    <header className="akkhor-header p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            ☰
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            Welcome To Vonyee's
          </div>
          <div className="text-sm font-medium">
            School Management System
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input 
              type="text" 
              placeholder="Search here..." 
              className="border-none text-sm py-1 px-3 focus:outline-none w-40 md:w-auto" 
            />
            <button className="bg-transparent px-2 text-gray-500">
              <Search size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="text-gray-500 relative">
              <BellRing size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                1
              </span>
            </button>
          </div>
          
          <div className="relative">
            <button className="text-gray-500 relative">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          
          <div className="flex items-center text-sm">
            <span className="text-gray-500 mr-1 hidden md:inline">English</span>
            <ChevronDown size={14} />
          </div>
          
          <div className="relative group">
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                <img 
                  src="https://i.pravatar.cc/150?u=admin" 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-xs text-gray-500">{currentUser.role}</div>
              </div>
              <ChevronDown size={14} className="ml-1" />
            </div>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                <button 
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
