import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-5 w-5" />
        <span className="text-sm font-medium">{user?.email}</span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="py-1" role="menu">
            <button
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  );
}