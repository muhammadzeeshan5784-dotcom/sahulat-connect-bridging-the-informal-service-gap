import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Clock, Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-frame">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <Home size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/results" className={({ isActive }) => isActive ? 'active' : ''}>
          <Search size={22} />
          <span>Search</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
          <Clock size={22} />
          <span>History</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
