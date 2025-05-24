import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Clock, Bookmark, Settings } from 'lucide-react';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/profile/trips', label: 'My Trips', icon: <Clock size={20} /> },
    { path: '/profile/saved', label: 'Saved Places', icon: <Bookmark size={20} /> },
    { path: '/profile/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-4 border-b-2 ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;