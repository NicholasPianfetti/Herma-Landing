import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (user) {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
            user 
              ? 'bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 hover:from-[var(--highlight-color)] hover:to-indigo-700' 
              : 'bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 hover:from-[var(--highlight-color)] hover:to-indigo-700'
          }`}
          aria-label={user ? 'Sign out' : 'Sign in'}
        >
          {user ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          )}
        </button>
        
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap">
            {user ? `Signed in as ${user.email}` : 'Sign in'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthButton;