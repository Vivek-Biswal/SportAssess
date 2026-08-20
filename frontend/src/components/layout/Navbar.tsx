import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Activity, Menu, X, LogOut, User, Moon, Sun } from 'lucide-react';
=======
import { Activity, Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
<<<<<<< HEAD
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
=======
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
<<<<<<< HEAD
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

=======
    setIsProfileOpen(false);
  };

  // --- Role-based link sets ---
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
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

<<<<<<< HEAD
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
=======
  // User initials for avatar
  const getUserInitial = () => {
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo + nav links */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600 text-white group-hover:bg-primary-700 transition-colors">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Sport<span className="text-primary-600">Assess</span>
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
              </span>
            </Link>
            <div className="hidden md:flex md:ml-10 md:space-x-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
<<<<<<< HEAD
                      ? 'border-primary-500 text-text-primary'
                      : 'border-transparent text-text-secondary hover:border-border-subtle hover:text-text-primary'
=======
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Auth buttons or user menu */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
<<<<<<< HEAD
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
=======
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                    {getUserInitial()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate hidden lg:block">
                    {user?.email || 'Account'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200/80 shadow-lg py-1 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                      <p className="text-xs text-slate-500 capitalize mt-0.5">{user?.role || 'Athlete'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-slate-400" />
                      Log Out
                    </button>
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Start Assessment</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
<<<<<<< HEAD
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-base focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
=======
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 transition-colors"
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="px-4 pt-2 pb-4 space-y-1 border-t border-slate-100">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
        </div>
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {getUserInitial()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role || 'Athlete'}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="w-full justify-center">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" className="w-full justify-center">Start Assessment</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
