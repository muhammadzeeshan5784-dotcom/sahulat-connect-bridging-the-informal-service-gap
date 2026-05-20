import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sahulat_history') || '[]');
      setHistory(stored);
    } catch {
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('sahulat_history');
    setHistory([]);
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">Booking History</h1>
            <p className="page-subtitle">{history.length} past bookings</p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              background: 'rgba(251,113,133,0.1)',
              border: '1px solid rgba(251,113,133,0.2)',
              borderRadius: 8,
              color: '#fb7185',
              cursor: 'pointer',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              fontFamily: 'inherit',
            }}
          >
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">No Bookings Yet</div>
          <div className="empty-state-desc">Your booking history will appear here after you complete a search and book a provider.</div>
          <button className="btn btn-primary mt-24" onClick={() => navigate('/')}>
            Start Searching
          </button>
        </div>
      )}

      {/* History List */}
      {history.map((booking, i) => (
        <motion.div
          key={booking.id}
          className="glass-card"
          style={{ padding: 16, marginBottom: 12 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9' }}>
                {booking.provider?.name || 'Unknown'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {booking.service} • {booking.location}
              </div>
            </div>
            <span className="badge badge-emerald">
              ✓ {booking.status}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>📅 {booking.date}</span>
            <span>⏰ {booking.time}</span>
            <span>💰 Rs. {booking.price}</span>
          </div>

          <div style={{ marginTop: 8 }}>
            <span className="booking-id" style={{ fontSize: '0.7rem' }}>{booking.id}</span>
          </div>

          {/* Notification summary */}
          {booking.notifications && booking.notifications.length > 0 && (
            <div style={{ marginTop: 10, fontSize: '0.72rem', color: '#64748b' }}>
              📬 {booking.notifications.length} follow-up actions configured
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
