import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, User, Home, LogOut, Bookmark, Clock, Settings, LayoutDashboard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const getInitialUser = async () => {
      const { data } = await supabase.auth.getUser();
      const initialUser = data?.user ?? null;
      setUser(initialUser);
      
      if (initialUser?.email === 'shanmukn21@gmail.com') {
        setIsAdmin(true);
      }
    };
    
    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser?.email === 'shanmukn21@gmail.com');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClass = isScrolled || location.pathname !== '/' 
    ? 'bg-white shadow-md text-gray-800' 
    : 'bg-transparent text-white';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);
    window.location.href = '/';
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Destinations', path: '/destinations', icon: <MapPin size={18} /> },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarClass}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-display text-2xl font-bold">
              <span className="text-primary-600">Yatra</span>SetGo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1.5 hover:text-primary-600 transition-colors ${
                  location.pathname === item.path ? 'text-primary-600 font-medium' : ''
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                >
                  <User size={18} />
                  Profile
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile/trips"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Clock size={16} />
                      My Trips
                    </Link>
                    <Link
                      to="/profile/saved"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Bookmark size={16} />
                      Saved Places
                    </Link>
                    <Link
                      to="/profile/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
              >
                <User size={18} />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full animate-fade-in">
          <div className="px-4 py-2 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 py-3 px-4 hover:bg-gray-100 rounded-lg ${
                  location.pathname === item.path ? 'text-primary-600 font-medium' : 'text-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 rounded-lg text-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile/trips"
                  className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 rounded-lg text-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <Clock size={18} />
                  My Trips
                </Link>
                <Link
                  to="/profile/saved"
                  className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 rounded-lg text-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <Bookmark size={18} />
                  Saved Places
                </Link>
                <Link
                  to="/profile/settings"
                  className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 rounded-lg text-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={18} />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 rounded-lg text-gray-800 w-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 rounded-lg text-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;