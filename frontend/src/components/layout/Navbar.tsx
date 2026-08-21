import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, LogOut, User, Moon, Sun, ChevronDown } from 'lucide-react';
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const publicLinks = [
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Benchmarks', path: '/benchmarks' },
  ];

  const athleteLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Assessments', path: '/assessments' },
    { name: 'My Assessments', path: '/my-assessments' },
  ];

  const officialLinks = [
    { name: 'Dashboard', path: '/official' },
    { name: 'Shortlist', path: '/official/shortlist' },
    { name: 'Profile', path: '/profile' },
  ];

  const getLinks = () => {
    if (!isAuthenticated) return publicLinks;
    if (user?.role === 'official') return officialLinks;
    return athleteLinks;
  };

  const links = getLinks();
  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-xl group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                <Activity className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-50">
                SportTalent<span className="text-primary-600 dark:text-primary-400">AI</span>
              </span>
            </Link>
            
            <div className="hidden md:flex md:ml-12 md:space-x-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-slate-100 dark:bg-slate-800 text-primary-700 dark:text-primary-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all focus:outline-none"
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-bold text-sm shadow-sm border border-primary-200/50 dark:border-primary-800/50">
                    {getInitials(user?.email || 'User')}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden animate-fade-in origin-top-right z-50">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                      <p className="font-bold text-slate-900 dark:text-slate-50 truncate">{user?.email || 'Authenticated User'}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize mt-1 tracking-wide">{user?.role || 'Athlete'} Account</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                        <Activity className="h-4 w-4 mr-3 text-slate-400" /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                        <User className="h-4 w-4 mr-3 text-slate-400" /> Profile
                      </Link>
                    </div>
                    
                    <div className="p-2 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                          {theme === 'dark' ? <Moon className="h-4 w-4 mr-3 text-slate-400" /> : <Sun className="h-4 w-4 mr-3 text-slate-400" />}
                          Dark Mode
                        </div>
                        <button 
                          onClick={toggleTheme}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
                          role="switch"
                          aria-checked={theme === 'dark'}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-2 border-t border-slate-100 dark:border-slate-700/50">
                      <button 
                        onClick={handleLogout} 
                        className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-slate-900 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-500 text-white font-semibold rounded-full px-6">Start Assessment</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-4">
             {isAuthenticated ? (
               <>
                 <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                   <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                     {theme === 'dark' ? <Moon className="h-5 w-5 mr-3 text-slate-400" /> : <Sun className="h-5 w-5 mr-3 text-slate-400" />}
                     Dark Mode
                   </div>
                   <button 
                     onClick={toggleTheme}
                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
                   >
                     <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                   </button>
                 </div>
                 <Button variant="outline" className="w-full justify-center rounded-xl" onClick={handleLogout}>Log Out</Button>
               </>
             ) : (
               <>
                 <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                   <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                     {theme === 'dark' ? <Moon className="h-5 w-5 mr-3 text-slate-400" /> : <Sun className="h-5 w-5 mr-3 text-slate-400" />}
                     Dark Mode
                   </div>
                   <button 
                     onClick={toggleTheme}
                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
                   >
                     <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                   </button>
                 </div>
                 <div className="flex gap-3">
                   <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                     <Button variant="outline" className="w-full justify-center rounded-xl">Log In</Button>
                   </Link>
                   <Link to="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                     <Button className="w-full justify-center bg-slate-900 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-500 text-white rounded-xl">Get Started</Button>
                   </Link>
                 </div>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
