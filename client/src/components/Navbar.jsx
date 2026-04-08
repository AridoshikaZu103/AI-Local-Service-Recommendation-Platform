import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('nearnest_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });
  const [showMenu, setShowMenu] = useState(false);
  const userRef = useRef(user);

  // Keep ref in sync with state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Poll localStorage for login/logout changes (runs only once on mount)
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('nearnest_user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { setUser(null); }
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorage);

    const interval = setInterval(() => {
      const current = localStorage.getItem('nearnest_user');
      const currentUser = userRef.current;
      if (current && !currentUser) {
        try { setUser(JSON.parse(current)); } catch {}
      } else if (!current && currentUser) {
        setUser(null);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []); // Empty dependency array — runs once only

  const handleSignOut = () => {
    localStorage.removeItem('nearnest_user');
    setUser(null);
    setShowMenu(false);
    navigate('/');
  };

  return (
    <div className="fixed w-full top-0 z-50 px-4 sm:px-6 py-4 pointer-events-none">
        <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 rounded-2xl pointer-events-auto"
        >
        <div className="px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-3 group">
                <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/30"
                >
                <Search size={22} className="stroke-[2.5]" />
                </motion.div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                    NearNest AI
                </span>
            </Link>
            <div className="flex gap-6 items-center">
                <Link to="/search" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
                    Find a Service
                </Link>

                {user ? (
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                    </motion.button>

                    <AnimatePresence>
                      {showMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_20px_50px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <LogOut size={16} /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/signin">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                )}
            </div>
            </div>
        </div>
        </motion.nav>
    </div>
  );
}
