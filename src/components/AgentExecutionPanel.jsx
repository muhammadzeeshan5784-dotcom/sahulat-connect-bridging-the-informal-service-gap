import { motion, AnimatePresence } from 'framer-motion';
import { AGENT_META, AGENT_STATES } from '../engine/orchestrator.js';

const STATE_LABELS = {
  idle: 'IDLE',
  thinking: 'THINKING',
  running: 'RUNNING',
  done: 'DONE',
  error: 'ERROR',
};

export default function AgentExecutionPanel({ agentStates }) {
  const agents = ['linguist', 'scout', 'negotiator', 'butler'];

  return (
    <div className="agent-panel">
      <p className="agent-panel-title">🤖 Agent Execution Pipeline</p>
      {agents.map((agentId) => {
        const meta = AGENT_META[agentId];
        const state = agentStates[agentId] || { state: AGENT_STATES.IDLE, message: 'Waiting...' };

        return (
          <motion.div
            key={agentId}
            className={`glass-card agent-card state-${state.state}`}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="agent-icon">{meta.icon}</div>
            <div className="agent-info">
              <div className="agent-label">{meta.label}</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.message}
                  className="agent-message"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {state.message}
                </motion.div>
              </AnimatePresence>
              <div className="agent-progress">
                <motion.div
                  className="agent-progress-bar"
                  animate={{
                    width: state.state === 'idle' ? '0%'
                      : state.state === 'thinking' ? '30%'
                      : state.state === 'running' ? '70%'
                      : '100%',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="agent-badge">
              <motion.span
                className={`state-dot state-dot-${state.state}`}
                animate={
                  state.state === 'thinking' || state.state === 'running'
                    ? { scale: [1, 1.3, 1] }
                    : { scale: 1 }
                }
                transition={
                  state.state === 'thinking' || state.state === 'running'
                    ? { repeat: Infinity, duration: 1.2 }
                    : {}
                }
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
