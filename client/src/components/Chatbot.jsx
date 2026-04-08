import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI assistant. Tell me what service you need and your city! (e.g. 'I need an electrician in Delhi')", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInput('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/services/chat`, { message: userText });
      setMessages(prev => [
        ...prev, 
        { text: res.data.reply, isBot: true, services: res.data.services }
      ]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Connection error. Trying to reach servers.", isBot: true }]);
    }
    setLoading(false);
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 bg-indigo-600 text-white p-5 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.5)] z-40 flex items-center justify-center transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageSquare size={28} className="stroke-[2.5]" />
      </motion.button>

      <AnimatePresence>
      {isOpen && (
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-8 right-8 w-80 sm:w-[400px] h-[550px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex flex-col z-50"
      >
        {/* Header */}
        <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-5 flex justify-between items-center shadow-md z-10 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="font-extrabold text-lg flex items-center gap-2 relative z-10 tracking-tight">
            <SparklesIcon /> AI Assistant
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors relative z-10">
            <X size={22} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-5 bg-slate-50 flex flex-col gap-4 scroll-smooth">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}
            >
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-[15px] font-medium leading-relaxed shadow-sm ${msg.isBot ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                {msg.text}
              </div>
              {msg.services && msg.services.length > 0 && (
                <div className="mt-3 flex flex-col gap-3 w-11/12 pr-2">
                  {msg.services.map(srv => (
                    <motion.div 
                      key={srv._id} whileHover={{ scale: 1.02 }}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-[0_4px_15px_rgb(0,0,0,0.03)] text-sm cursor-pointer"
                    >
                      <div className="font-extrabold text-slate-800 text-base mb-1">{srv.name}</div>
                      <div className="text-slate-500 font-medium mb-3">{srv.category} in {srv.location}</div>
                      <div className="text-indigo-600 font-black bg-indigo-50 inline-block px-3 py-1 rounded-lg">{srv.price}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-1 text-indigo-400 p-2 bg-white w-fit px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3 relative z-10">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="E.g. Electrician in Delhi..."
            className="flex-grow px-4 py-3 outline-none text-base text-slate-800 font-medium bg-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          <button type="submit" disabled={!input.trim() || loading} className="bg-indigo-600 hover:bg-slate-900 text-white p-3.5 rounded-xl disabled:opacity-50 transition-all shadow-md">
            <Send size={20} className="stroke-[2.5]" />
          </button>
        </form>
      </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

function SparklesIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
}
