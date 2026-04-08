import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, ShieldCheck, MapPin, Phone, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchService = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    axios.get(`${API_URL}/api/services/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReviewText) return;
    
    setSubmitting(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    axios.post(`${API_URL}/api/services/${id}/reviews`, {
      text: newReviewText,
      rating: newReviewRating
    })
    .then(() => {
      setNewReviewText('');
      setSubmitting(false);
      fetchService();
    })
    .catch(err => {
      console.error(err);
      setSubmitting(false);
    });
  };

  if (!data) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  const { service, reviews } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10 mt-12"
    >
      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row gap-12 items-center md:items-start relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-40 h-40 bg-gradient-to-br from-indigo-100 to-violet-50 rounded-[2rem] flex items-center justify-center text-6xl flex-shrink-0 shadow-inner border border-indigo-50"
        >
          🛠️
        </motion.div>
        
        <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-4 mb-3">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">{service.name}</h1>
                {service.is_verified && (
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border border-emerald-200">
                    <ShieldCheck size={18} /> Verified Pro
                    </span>
                )}
            </div>
            
            <div className="text-indigo-600 font-extrabold text-lg uppercase tracking-wider mb-6 bg-indigo-50 inline-block px-3 py-1 rounded-lg">{service.category}</div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-base text-slate-600 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 font-medium">
                <div className="flex items-center gap-2">
                    <MapPin className="text-slate-400" size={20} /> {service.location}
                </div>
                <div className="flex items-center gap-2">
                    <Star className="text-amber-500 fill-amber-500" size={20} /> 
                    <span className="font-extrabold text-slate-800 text-lg">{service.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({service.reviewCount} Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-extrabold bg-slate-800 text-white px-3 py-1 rounded-lg">{service.price}</span>
                </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3 w-full md:w-auto justify-center text-lg"
            >
                <Phone size={22} /> Contact Expert: {service.contact_info}
            </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
            <MessageSquareQuote size={32} className="text-indigo-500 stroke-[2.5]" />
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">AI Verified Reviews</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={submitReview} className="lg:col-span-1 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 h-fit sticky top-28">
              <h3 className="font-extrabold text-xl text-slate-800 mb-6">Leave Feedback</h3>
              
              <div className="mb-5">
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Rating</label>
                  <select 
                      value={newReviewRating} 
                      onChange={e => setNewReviewRating(Number(e.target.value))}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-sm transition-shadow"
                  >
                      {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                  </select>
              </div>
              
              <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Your Experience</label>
                  <textarea 
                      value={newReviewText}
                      onChange={e => setNewReviewText(e.target.value)}
                      required
                      className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[140px] resize-none font-medium shadow-sm transition-shadow"
                      placeholder="Share your experience... Our AI will analyze your sentiment instantly!"
                  />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting} 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-indigo-600/30 flex justify-center items-center gap-2"
              >
                  {submitting ? 'Analyzing...' : <><CheckCircle2 size={20} /> Publish Review</>}
              </motion.button>
          </form>

          <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                  <div className="text-slate-400 italic font-medium p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">No reviews yet. Be the first to try!</div>
              ) : (
                  reviews.map((review, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={review._id} 
                        className="p-8 border border-slate-100 rounded-[2rem] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-200 transition-all bg-white"
                      >
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex text-amber-500 gap-1 mt-1">
                                  {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={18} className="fill-amber-500" />)}
                              </div>
                              <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                                  {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                          </div>
                          <p className="text-slate-700 mb-6 text-lg leading-relaxed">{review.text}</p>
                          <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Verdict:</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                                  review.ai_sentiment_score === 'Positive' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                  review.ai_sentiment_score === 'Negative' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                  'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                  {review.ai_sentiment_score || 'Neutral'}
                              </span>
                          </div>
                      </motion.div>
                  ))
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
