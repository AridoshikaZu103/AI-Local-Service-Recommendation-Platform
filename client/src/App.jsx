import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ServiceDetails from './pages/ServiceDetails';
import SignIn from './pages/SignIn';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </main>
      <Chatbot />
    </div>
  );
}

export default App;
