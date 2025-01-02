import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { UserMenu } from './user-menu';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 text-xl font-semibold text-gray-900">SFA System</div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};