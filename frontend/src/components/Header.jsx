import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-purple-600' : 'hover:bg-purple-700';
  };

  return (
    <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-4xl group-hover:scale-110 transition-transform">🌌</div>
            <div>
              <h1 className="text-2xl font-bold glow-text">Cosmic TON Rangers</h1>
              <p className="text-xs text-gray-400">Farm TON no Telegram</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/')}`}
            >
              🏠 Home
            </Link>
            <Link
              to="/shop"
              className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/shop')}`}
            >
              🛒 Loja
            </Link>
            <Link
              to="/inventory"
              className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/inventory')}`}
            >
              🎒 Inventário
            </Link>
            <Link
              to="/economics"
              className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/economics')}`}
            >
              📊 Economia
            </Link>
            <Link
              to="/stats"
              className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/stats')}`}
            >
              📈 Stats
            </Link>
          </nav>

          {/* Wallet Button (placeholder) */}
          <button className="cosmic-button hidden md:block">
            💎 Conectar Wallet
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-3xl">☰</button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex flex-col gap-2 mt-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/')}`}
          >
            🏠 Home
          </Link>
          <Link
            to="/shop"
            className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/shop')}`}
          >
            🛒 Loja
          </Link>
          <Link
            to="/inventory"
            className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/inventory')}`}
          >
            🎒 Inventário
          </Link>
          <Link
            to="/economics"
            className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/economics')}`}
          >
            📊 Economia
          </Link>
          <Link
            to="/stats"
            className={`px-4 py-2 rounded-lg font-semibold transition ${isActive('/stats')}`}
          >
            📈 Stats
          </Link>
          <button className="cosmic-button w-full">
            💎 Conectar Wallet
          </button>
        </nav>
      </div>
    </header>
  );
}
