import { Star, MapPin, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProviderCard({ provider, rank, onBook }) {
  return (
    <motion.div
      className="glass-card provider-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.4 }}
    >
      <div className="provider-card-header">
        <div>
          <div className="provider-name">
            {rank === 0 && <span style={{ marginRight: 6 }}>👑</span>}
            {provider.name}
          </div>
          <div className="provider-category">{provider.category} • {provider.sector}</div>
        </div>
        <div className="provider-score">
          <div className="provider-score-value">{provider.compositeScore}</div>
          <div className="provider-score-label">Score</div>
        </div>
      </div>

      <div className="provider-meta">
        <div className="provider-meta-item">
          <Star size={14} style={{ color: '#fbbf24' }} />
          {provider.rating}★ ({provider.reviews})
        </div>
        <div className="provider-meta-item">
          <MapPin size={14} />
          {provider.distance} km
        </div>
        <div className="provider-meta-item">
          <Clock size={14} />
          {provider.available ? provider.nextSlot : 'Unavailable'}
        </div>
        <div className="provider-meta-item">
          <Phone size={14} />
          {provider.phone}
        </div>
      </div>

      {/* Score breakdown */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap'
      }}>
        <span className="badge badge-emerald">Rating: {provider.scoreBreakdown.rating}</span>
        <span className="badge badge-cyan">Proximity: {provider.scoreBreakdown.proximity}</span>
        <span className="badge badge-yellow">
          Avail: {provider.scoreBreakdown.availability}
        </span>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 10 }}>
        💰 Rs. {provider.price} • 🛠 {provider.experience}
      </div>

      <div className="provider-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onBook(provider)}
          disabled={!provider.available}
          style={!provider.available ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
        >
          {provider.available ? 'Book Now' : 'Unavailable'}
        </button>
        <a href={`tel:${provider.phone}`} className="btn btn-secondary btn-sm">
          Call
        </a>
      </div>
    </motion.div>
  );
}
