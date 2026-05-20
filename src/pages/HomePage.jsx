import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import CategoryGrid from '../components/CategoryGrid';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate('/results', { state: { query } });
  };

  return (
    <div className="page">
      {/* Hero */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-label">Powered by Agentic AI</div>
        <h1 className="hero-title">
          Sahulat
        </h1>
        <p className="hero-desc">
          A smarter way to access home and professional services across Pakistan. Sahulat's AI engine understands your request, surfaces the right experts, and handles the booking so you don't have to.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <SearchBar onSearch={handleSearch} />
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <CategoryGrid onSelect={handleSearch} />
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <p className="section-label">How It Works</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '🧠', title: 'Agent A — Linguist', desc: 'Understands your request in any language' },
            { icon: '🔍', title: 'Agent B — Scout', desc: 'Finds & ranks nearby providers' },
            { icon: '🤝', title: 'Agent C — Negotiator', desc: 'Books the best available slot' },
            { icon: '🔔', title: 'Agent D — Butler', desc: 'Handles reminders & follow-ups' },
          ].map((step, i) => (
            <div key={i} className="glass-card" style={{ padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: '1.3rem', width: 40, textAlign: 'center' }}>{step.icon}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>{step.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
