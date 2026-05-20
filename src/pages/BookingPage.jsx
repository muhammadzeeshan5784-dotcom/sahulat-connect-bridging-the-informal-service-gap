import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, AlertCircle } from 'lucide-react';
import BookingConfirmation from '../components/BookingConfirmation';
import NotificationList from '../components/NotificationList';
import AgentExecutionPanel from '../components/AgentExecutionPanel';
import EventLog from '../components/EventLog';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { provider, intent, booking, notifications, events, agentStates } = location.state || {};

  if (!provider) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
        <p>No booking data found.</p>
        <button onClick={() => navigate('/')} className="primary-btn" style={{ marginTop: 20 }}>
          Go Home
        </button>
      </div>
    );
  }

  const isBookingFailed = agentStates?.negotiator?.state === 'error' || !booking;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="page-title">Booking Status</h1>
          <p className="page-subtitle" style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {provider.name}
          </p>
        </div>
      </div>

      <AgentExecutionPanel agentStates={agentStates} />
      
      {/* Booking Error State */}
      {isBookingFailed ? (
        <motion.div
           className="glass-card"
           style={{ padding: 24, marginTop: 20, textAlign: 'center', borderColor: '#ef4444' }}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
        >
           <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 12px' }} />
           <h3 style={{ margin: '0 0 8px', color: '#f1f5f9' }}>Slot Available Nahi Hai</h3>
           <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 20 }}>
             Yeh waqt abhi available nahi hai. Doosra waqt chunein ya wapas jayen.
           </p>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
             <button className="pill-btn">Aaj 4:00 PM</button>
             <button className="pill-btn">Kal 10:00 AM</button>
             <button className="pill-btn">Kal 2:00 PM</button>
           </div>
           
           <button onClick={() => navigate(-1)} className="primary-btn">Wapas Jayen</button>
        </motion.div>
      ) : (
        <>
          <BookingConfirmation booking={booking} provider={provider} />
          <NotificationList notifications={notifications} />
        </>
      )}

      <EventLog events={events} />

      <div style={{ textAlign: 'center', marginTop: 30, marginBottom: 20 }}>
        <button onClick={() => navigate('/')} className="secondary-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Home size={18} />
          Back to Home
        </button>
      </div>
    </div>
  );
}
