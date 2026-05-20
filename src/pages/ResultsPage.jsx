import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, AlertTriangle, HelpCircle } from 'lucide-react';
import { runOrchestrator } from '../engine/orchestrator';
import AgentExecutionPanel from '../components/AgentExecutionPanel';
import EventLog from '../components/EventLog';
import ProviderCard from '../components/ProviderCard';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query || '';

  const [agentStates, setAgentStates] = useState({
    linguist: { state: 'idle', message: 'Waiting...' },
    scout: { state: 'idle', message: 'Waiting...' },
    negotiator: { state: 'idle', message: 'Waiting...' },
    butler: { state: 'idle', message: 'Waiting...' },
  });
  const [events, setEvents] = useState([]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleAgentState = useCallback((agentId, state, message) => {
    setAgentStates((prev) => ({
      ...prev,
      [agentId]: { state, message },
    }));
  }, []);

  const handleEvent = useCallback((event) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  useEffect(() => {
    if (!query || hasRun) return;
    setHasRun(true);
    setIsRunning(true);

    runOrchestrator(query, {
      onAgentState: handleAgentState,
      onEvent: handleEvent,
    }).then((res) => {
      setResult(res);
      setIsRunning(false);
    }).catch((err) => {
      console.error('Orchestrator error:', err);
      setIsRunning(false);
    });
  }, [query, hasRun, handleAgentState, handleEvent]);

  const handleBook = (provider) => {
    navigate('/booking', {
      state: {
        provider,
        intent: result?.intent,
        booking: result?.booking,
        notifications: result?.notifications,
        events,
        agentStates,
      },
    });
  };

  const handleRetry = (newQuery) => {
    navigate('/results', { state: { query: newQuery }, replace: true });
    navigate(0); // force reload for now to reset state easily
  };

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
          <h1 className="page-title">Processing Request</h1>
          <p className="page-subtitle" style={{ fontSize: '0.78rem', color: '#64748b' }}>
            "{query}"
          </p>
        </div>
      </div>

      {/* Agent Execution Panel */}
      <AgentExecutionPanel agentStates={agentStates} />

      {/* Event Log */}
      <EventLog events={events} />

      {/* Skeleton Loading State */}
      {isRunning && !result && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map((i) => (
             <div key={i} className="glass-card skeleton-pulse" style={{ height: 120, borderRadius: 12 }}></div>
          ))}
        </div>
      )}

      {/* Unrecognized Query State */}
      {result?.query_type === 'unknown' && (
        <motion.div
          className="glass-card"
          style={{ padding: 24, marginTop: 20, textAlign: 'center', borderColor: '#ef4444' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HelpCircle size={40} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 8px', color: '#f1f5f9' }}>Yeh samajh nahi aaya</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 20 }}>
            Kuch aur try karein jaise:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="pill-btn" onClick={() => handleRetry('bijli nahi aa rahi')}>"bijli nahi aa rahi"</button>
            <button className="pill-btn" onClick={() => handleRetry('AC thanda nahi kr raha')}>"AC thanda nahi kr raha"</button>
            <button className="pill-btn" onClick={() => handleRetry('mujhe G-11 mein darzi chahiye')}>"mujhe G-11 mein darzi chahiye"</button>
          </div>
          <button onClick={() => navigate('/')} className="primary-btn" style={{ marginTop: 24 }}>Wapas Jayen</button>
        </motion.div>
      )}

      {/* AI Diagnosis Card (For Problem Queries) */}
      {result?.explanation && result.query_type === 'problem' && (
        <motion.div
          className="diagnosis-card"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <Brain color="#fbbf24" size={24} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ margin: '0 0 6px', color: '#fef3c7', fontSize: '1.05rem' }}>{result.explanation.headline}</h3>
              <p style={{ margin: '0 0 8px', color: '#fde68a', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {result.explanation.diagnosis}
              </p>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.85rem', fontStyle: 'italic' }}>
                {result.explanation.action}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Provider Results */}
      {result?.providers && result.providers.length > 0 && result.query_type !== 'unknown' && (
        <div style={{ marginTop: 20 }}>
          {result.relaxed ? (
             <div className="glass-card" style={{ padding: '12px 16px', marginBottom: 16, backgroundColor: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.2)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#fef08a' }}>
                   Aapke area mein koi provider nahi mila. Yeh nearby options hain:
                </p>
             </div>
          ) : (
             <p className="section-label">🏆 Top Providers ({result.providers.length})</p>
          )}
          
          {result.providers.map((provider, i) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              rank={i}
              onBook={handleBook}
            />
          ))}
        </div>
      )}

      {/* Truly Empty State */}
      {result && result.providers.length === 0 && result.query_type !== 'unknown' && (
         <motion.div
         className="glass-card"
         style={{ padding: 24, marginTop: 20, textAlign: 'center' }}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
       >
         <AlertTriangle size={40} color="#fbbf24" style={{ margin: '0 auto 12px' }} />
         <h3 style={{ margin: '0 0 8px', color: '#f1f5f9' }}>Koi Provider Nahi Mila</h3>
         <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 20 }}>
           Abhi is area mein koi {result.intent?.category} registered nahi. Jaldi aa rahe hain!
         </p>
         <button onClick={() => navigate('/')} className="primary-btn">Dobara Try Karein</button>
       </motion.div>
      )}
    </div>
  );
}
