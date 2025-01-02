import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useMenuAccess } from '../hooks/useMenuAccess';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { accessibleMenus, loading } = useMenuAccess();

  if (loading) {
    return <div className="w-64 bg-gray-900">Loading...</div>;
  }

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="mr-3 h-5 w-5" /> : null;
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static
      `}
    >
      <div className="h-full flex flex-col">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {accessibleMenus.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              {getIcon(item.icon)}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};