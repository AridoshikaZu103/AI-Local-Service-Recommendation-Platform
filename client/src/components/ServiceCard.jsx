import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceCard({ service, rank }) {
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  // Day 2: Rank badge colors for Top 3 AI picks
  const rankColors = {
    1: 'from-amber-400 to-yellow-500 text-white shadow-amber-200',
    2: 'from-slate-300 to-slate-400 text-white shadow-slate-200',
    3: 'from-orange-300 to-orange-400 text-white shadow-orange-200'
  };

  return (
    <motion.div variants={item} whileHover={{ y: -8 }}>
      <Link to={`/service/${service._id}`} className="block group h-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] hover:border-indigo-200 transition-all duration-500 flex flex-col h-full relative">
          
          <div className="h-48 bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-violet-50 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <motion.div 
               whileHover={{ scale: 1.1, rotate: 5 }}
               className="text-6xl z-10 filter drop-shadow-sm"
            >
              🛠️
            </motion.div>
            
            {/* Day 2: Rank badge for AI Top Picks */}
            {rank && rankColors[rank] && (
              <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${rankColors[rank]} flex items-center justify-center text-sm font-black shadow-lg z-10`}>
                #{rank}
              </div>
            )}

            {service.is_verified && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-emerald-600 flex items-center gap-1.5 shadow-sm border border-emerald-100 z-10 uppercase tracking-wide">
                <ShieldCheck size={14} className="stroke-[2.5]" /> Verified
              </div>
            )}
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg">{service.category}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-3 group-hover:text-indigo-600 transition-colors leading-tight">{service.name}</h3>
              </div>
              <div className="flex items-center bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/50">
                <Star size={14} className="text-amber-500 fill-amber-500 mr-1" />
                <span className="font-bold text-slate-800 text-sm">{service.rating?.toFixed(1) || '0.0'}</span>
              </div>
            </div>

            {/* Day 2: AI Trust Score badge when available */}
            {service.ai_score != null && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-indigo-100/50">
                <Brain size={14} className="text-indigo-500" />
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">AI Trust Score</span>
                <span className="ml-auto text-sm font-black text-indigo-700">
                  {(service.ai_score * 100).toFixed(0)}%
                </span>
              </div>
            )}
            
            <div className="flex items-center text-slate-500 text-sm mt-auto py-4 border-b border-slate-50">
              <MapPin size={16} className="mr-1.5 opacity-60" /> {service.location}
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-slate-800 text-lg font-bold">{service.price}</span>
              <span className="text-sm text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center">
                Explore <span className="ml-1">→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
