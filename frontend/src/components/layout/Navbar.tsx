import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, LogOut, User, Moon, Sun } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Assessments', path: '/assessments' },
  ];

  const authLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Assessments', path: '/my-assessments' },
  ];

  const links = isAuthenticated ? authLinks : publicLinks;

  const isActive = (path: string) => location.pathname === path;

  // Initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-bg-surface border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl tracking-tight text-text-primary">
                SportTalent <span className="text-primary-600">AI</span>
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(link.path)
                      ? 'border-primary-500 text-text-primary'
                      : 'border-transparent text-text-secondary hover:border-border-subtle hover:text-text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-700 font-bold hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 transition-all dark:bg-primary-900/50 dark:text-primary-100"
                >
                  {getInitials(user?.email || 'User')}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border-subtle bg-bg-surface shadow-lg overflow-hidden animate-fade-in origin-top-right z-50">
                    <div className="p-4 border-b border-border-subtle bg-bg-base/50">
                      <p className="font-medium text-text-primary truncate">{user?.email || 'Authenticated User'}</p>
                      <p className="text-sm text-text-secondary capitalize">{user?.role || 'Athlete'}</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-3 py-2 text-sm font-medium text-text-secondary rounded-md hover:bg-bg-base hover:text-text-primary transition-colors">
                        <Activity className="h-4 w-4 mr-3 opacity-70" /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-3 py-2 text-sm font-medium text-text-secondary rounded-md hover:bg-bg-base hover:text-text-primary transition-colors">
                        <User className="h-4 w-4 mr-3 opacity-70" /> Profile
                      </Link>
                    </div>
                    
                    <div className="p-2 border-t border-border-subtle">
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center text-sm font-medium text-text-secondary">
                          {theme === 'dark' ? <Moon className="h-4 w-4 mr-3 opacity-70" /> : <Sun className="h-4 w-4 mr-3 opacity-70" />}
                          Dark Mode
                        </div>
                        <button 
                          onClick={toggleTheme}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
                          role="switch"
                          aria-checked={theme === 'dark'}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-2 border-t border-border-subtle">
                      <button 
                        onClick={handleLogout} 
                        className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-base focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden bg-bg-surface border-b border-border-subtle" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'border-transparent text-text-secondary hover:bg-bg-base hover:border-border-subtle hover:text-text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border-subtle px-4 flex flex-col space-y-2">
             {isAuthenticated ? (
               <>
                 <div className="flex items-center justify-between py-2 mb-2 border-b border-border-subtle">
                   <div className="flex items-center text-sm font-medium text-text-secondary">
                     {theme === 'dark' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                     Dark Mode
                   </div>
                   <button 
                     onClick={toggleTheme}
                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
                   >
                     <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                   </button>
                 </div>
                 <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>Log Out</Button>
               </>
             ) : (
               <>
                 <div className="flex items-center justify-between py-2 mb-2 border-b border-border-subtle">
                   <span className="text-sm font-medium text-text-secondary">Theme</span>
                   <button 
                     onClick={toggleTheme}
                     className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
                   >
                     <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                   </button>
                 </div>
                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button variant="outline" className="w-full justify-center">Log In</Button>
                 </Link>
                 <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button variant="primary" className="w-full justify-center">Get Started</Button>
                 </Link>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
