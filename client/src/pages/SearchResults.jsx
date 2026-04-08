import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import { Filter, ArrowDownWideNarrow, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating_desc');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(1);

  const categoryStr = searchParams.get('category') || '';

  // Fetch services from API when category or sort changes
  useEffect(() => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Pass sort parameter to backend for deterministic ordering
    const sortParam = sortBy === 'rating_asc' ? '&sort=rating_asc'
                    : sortBy === 'newest' ? '&sort=newest'
                    : ''; // default is rating desc (server default)

    axios.get(`${API_URL}/api/services?category=${categoryStr}${sortParam}`)
      .then(res => {
        setAllServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [categoryStr, sortBy]);

  // Apply client-side filters (Verified Only + Minimum Rating)
  useEffect(() => {
    let filtered = [...allServices];

    if (verifiedOnly) {
      filtered = filtered.filter(s => s.is_verified === true);
    }

    if (minRating > 1) {
      filtered = filtered.filter(s => s.rating >= minRating);
    }

    setServices(filtered);
  }, [allServices, verifiedOnly, minRating]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-8 mt-12"
    >
      <aside className="w-full md:w-72 flex-shrink-0">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-28">
          <div className="flex items-center gap-2 mb-6 font-extrabold text-xl text-slate-800 border-b border-slate-100 pb-4">
            <Filter size={20} className="text-indigo-600" /> Refine Results
          </div>
          <div className="space-y-6">
               {/* Sort dropdown */}
               <div>
                  <h4 className="font-bold text-slate-700 mb-3 text-sm tracking-wide uppercase flex items-center gap-2">
                    <ArrowDownWideNarrow size={16} className="text-indigo-500" /> Sort By
                  </h4>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-sm text-sm text-slate-700"
                  >
                    <option value="rating_desc">★ Highest Rated First</option>
                    <option value="rating_asc">★ Lowest Rated First</option>
                    <option value="newest">🕐 Newest First</option>
                  </select>
               </div>
               {/* Verified Only filter */}
               <div>
                  <h4 className="font-bold text-slate-700 mb-3 text-sm tracking-wide uppercase flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" /> Verification
                  </h4>
                  <label className="flex items-center gap-3 text-slate-600 font-medium cursor-pointer group">
                    <input
                      id="verified-checkbox"
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                    />
                    <span className={`transition-colors ${verifiedOnly ? 'text-indigo-600 font-bold' : 'group-hover:text-indigo-600'}`}>
                      Verified Only
                    </span>
                    {verifiedOnly && (
                      <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">ON</span>
                    )}
                  </label>
               </div>
               {/* Minimum Rating filter */}
               <div>
                  <h4 className="font-bold text-slate-700 mb-3 text-sm tracking-wide uppercase flex items-center gap-2">
                    <Star size={16} className="text-amber-500" /> Minimum Rating
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-2xl font-black text-indigo-600">{minRating}</span>
                      <Star size={20} className="text-amber-500 fill-amber-500 ml-1" />
                      <span className="text-sm text-slate-400 ml-2 font-medium">& above</span>
                    </div>
                    <input
                      id="min-rating-slider"
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={minRating}
                      onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                        <span>1 ★</span><span>5 ★</span>
                    </div>
                  </div>
               </div>
          </div>

          {/* Active filters summary */}
          {(verifiedOnly || minRating > 1) && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Filters</span>
                <button
                  onClick={() => { setVerifiedOnly(false); setMinRating(1); }}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {verifiedOnly && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
                {minRating > 1 && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <Star size={12} className="fill-amber-500" /> ≥ {minRating}★
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-grow">
        <div className="mb-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {categoryStr ? `Results for "${categoryStr}"` : 'All Available Services'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium text-lg">
              Found <span className="text-indigo-600 font-bold">{services.length}</span> highly-rated professionals
              {allServices.length !== services.length && (
                <span className="text-slate-400 ml-1 text-sm">(of {allServices.length} total)</span>
              )}
              <span className="text-slate-400 ml-2 text-sm">
                • Sorted by {sortBy === 'rating_desc' ? 'highest rating' : sortBy === 'rating_asc' ? 'lowest rating' : 'newest'}
              </span>
            </p>
        </div>

        {loading ? (
             <div className="text-center py-32 text-slate-400 flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
               <span className="font-medium text-lg">Searching network...</span>
             </div>
        ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
            {services.map(service => (
                <ServiceCard key={service._id} service={service} />
            ))}
            {services.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed text-slate-500 font-medium">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-lg mb-2">No services found matching your exact criteria.</p>
                    <p className="text-sm text-slate-400">
                      Try adjusting your filters above{minRating > 1 && ' or lowering the minimum rating'}{verifiedOnly && ' or unchecking Verified Only'}.
                    </p>
                </div>
            )}
            </motion.div>
        )}
      </div>
    </motion.div>
  );
}
