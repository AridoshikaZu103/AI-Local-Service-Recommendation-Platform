import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    // Simulate auth delay
    setTimeout(() => {
      if (isSignUp) {
        // Register user in localStorage
        const users = JSON.parse(localStorage.getItem('nearnest_users') || '[]');
        const exists = users.find(u => u.email === email);
        if (exists) {
          setError('An account with this email already exists.');
          setLoading(false);
          return;
        }
        users.push({ name, email, password, createdAt: new Date().toISOString() });
        localStorage.setItem('nearnest_users', JSON.stringify(users));
        localStorage.setItem('nearnest_user', JSON.stringify({ name, email }));
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/'), 1200);
      } else {
        // Login: check localStorage
        const users = JSON.parse(localStorage.getItem('nearnest_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }
        localStorage.setItem('nearnest_user', JSON.stringify({ name: user.name, email: user.email }));
        setSuccess('Welcome back! Redirecting...');
        setTimeout(() => navigate('/'), 1200);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center mt-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Home
        </motion.button>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.06)] p-8 sm:p-10 relative overflow-hidden">
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/30"
            >
              {isSignUp ? <UserPlus size={28} className="text-white" /> : <LogIn size={28} className="text-white" />}
            </motion.div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {isSignUp ? 'Join NearNest AI to discover top services' : 'Sign in to your NearNest AI account'}
            </p>
          </div>

          {/* Error / Success messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center gap-2"
              >
                <Sparkles size={16} /> {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <UserPlus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium text-slate-800 shadow-sm transition-all placeholder-slate-400"
                      placeholder="John Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium text-slate-800 shadow-sm transition-all placeholder-slate-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium text-slate-800 shadow-sm transition-all placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex justify-center items-center gap-2 text-lg disabled:opacity-60"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p className="text-slate-500 font-medium">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
                className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
