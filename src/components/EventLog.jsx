import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export default function EventLog({ events }) {
  const scrollRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  // Auto-scroll to bottom on new events
  useEffect(() => {
    if (scrollRef.current && !collapsed) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, collapsed]);

  return (
    <div className="event-log glass-card" style={{ marginTop: 16 }}>
      <div className="event-log-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="event-log-title">
          <Terminal size={14} />
          AI Workflow Timeline
          {events.length > 0 && (
            <span className="event-log-count">{events.length}</span>
          )}
        </div>
        {collapsed ? <ChevronDown size={16} style={{ color: '#64748b' }} /> : <ChevronUp size={16} style={{ color: '#64748b' }} />}
      </div>

      {!collapsed && (
        <motion.div
          className="event-log-body"
          ref={scrollRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.8rem' }}>
              Waiting for pipeline to start...
            </div>
          )}

          <AnimatePresence initial={false}>
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="event-entry"
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <span className="event-time">
                  {event.timestamp ? formatTimestamp(event.timestamp) : '--:--:--'}
                </span>
                <span className={`event-agent-label event-agent-${event.agent}`}>
                  {event.agent?.toUpperCase().slice(0, 4)}
                </span>
                <span className="event-type-badge">{event.type}</span>
                <span className="event-message">{event.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
