import { motion } from 'framer-motion';

export default function AgentTraceStep({ step, index }) {
  if (!step) return null;

  return (
    <motion.div
      className="glass-card"
      style={{ padding: '12px 14px', marginBottom: 8 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: '1rem' }}>{step.icon}</span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: step.color || '#6ee7b7',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {step.agent}
        </span>
        <span className="badge badge-emerald" style={{ marginLeft: 'auto' }}>
          {step.type}
        </span>
      </div>
      <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
        {step.message}
      </div>
    </motion.div>
  );
}
