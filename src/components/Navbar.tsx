import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import PanicButton from './PanicButton';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="w-6 h-6" />
            SafeSpeak
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`transition ${isActive('/') ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'}`}
            >
              Home
            </Link>
            <Link
              to="/submit"
              className={`transition ${isActive('/submit') ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'}`}
            >
              Submit Report
            </Link>
            <Link
              to="/retrieve"
              className={`transition ${isActive('/retrieve') ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'}`}
            >
              Retrieve Evidence
            </Link>
            <Link
              to="/resources"
              className={`transition ${isActive('/resources') ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'}`}
            >
              Resources
            </Link>
            <PanicButton />
          </div>

          <div className="md:hidden">
            <PanicButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
