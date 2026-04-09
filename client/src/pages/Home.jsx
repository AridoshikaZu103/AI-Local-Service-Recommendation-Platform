import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'framer-motion';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://nearnest-server.vercel.app';
    // Day 2 Fix: Use /ranked endpoint for AI Trust Score sorted results
    axios.get(`${API_URL}/api/services/ranked?limit=3`)
      .then(res => setServices(res.data))
      .catch(err => {
        console.warn('Ranked endpoint unavailable, falling back to sorted services:', err.message);
        // Fallback: fetch all services sorted by rating
        axios.get(`${API_URL}/api/services`)
          .then(res => setServices(res.data.slice(0, 3)))
          .catch(fallbackErr => console.error(fallbackErr));
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?category=${searchQuery}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="space-y-24 mt-10">
      {/* Hero Section */}
      <section className="relative mesh-pattern rounded-[2.5rem] p-10 sm:p-20 shadow-2xl text-center overflow-hidden border border-slate-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-sm mb-8"
          >
            <Sparkles size={16} /> The New Standard in Local Services
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight"
          >
            Find the perfect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 glow-pulse">
              Professional Today.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 font-medium"
          >
            Electricians, plumbers, and home salons. Powered by AI recommendation to guarantee you get the best.
          </motion.p>

          <motion.form
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto flex shadow-[0_0_40px_rgba(99,102,241,0.2)] rounded-2xl bg-white/10 backdrop-blur-md overflow-hidden border border-white/20 focus-within:border-indigo-400 focus-within:bg-white/15 transition-all p-1"
          >
            <div className="pl-6 py-4 flex items-center text-indigo-300">
              <Search size={24} />
            </div>
            <input
              type="text"
              className="flex-grow px-5 py-5 outline-none text-slate-900 placeholder-slate-400 bg-transparent text-lg font-medium"
              placeholder="E.g. AC Repair in hyderabad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-5 rounded-xl transition-all text-lg flex items-center gap-2 shadow-lg m-1">
              Search
            </button>
          </motion.form>
        </motion.div>
      </section>

      {/* Top Picks Section — Day 2: Now powered by AI Trust Score */}
      <section className="px-4">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <TrendingUp size={28} className="text-indigo-600" />
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">AI Curated Top Picks</h2>
        </div>
        <p className="text-center text-slate-500 font-medium mb-8 max-w-xl mx-auto">
          Ranked by our AI Trust Score — combining rating, review volume, sentiment analysis, and verification status.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} rank={index + 1} />
          ))}
          {services.length === 0 && <p className="text-slate-500 text-center col-span-full">Loading premium services...</p>}
        </motion.div>
      </section>
    </div>
  );
}
