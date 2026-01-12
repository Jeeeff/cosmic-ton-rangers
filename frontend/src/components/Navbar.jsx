import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Início', icon: '🏠' },
    { path: '/shop', label: 'Loja', icon: '🛒' },
    { path: '/farm', label: 'Farm', icon: '🌾' },
    { path: '/rangers', label: 'Rangers', icon: '👥' },
    { path: '/missions', label: 'Missões', icon: '🎯' },
    { path: '/marketplace', label: 'Mercado', icon: '💰' },
    { path: '/profile', label: 'Perfil', icon: '👤' }
  ];

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🚀</span>
            <span className="text-xl font-bold glow-text hidden sm:inline">
              Cosmic TON Rangers
            </span>
            <span className="text-xl font-bold glow-text sm:hidden">
              CTR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  isActive(link.path)
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-purple-900/50 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                  isActive(link.path)
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
                }`}
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium text-lg">{link.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
