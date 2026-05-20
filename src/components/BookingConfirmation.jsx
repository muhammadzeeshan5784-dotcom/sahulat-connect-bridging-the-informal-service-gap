import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function BookingConfirmation({ booking }) {
  if (!booking) return null;

  return (
    <motion.div
      className="glass-card booking-success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <motion.div
        className="booking-check"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <CheckCircle size={36} />
      </motion.div>

      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>
        Booking Confirmed!
      </h2>

      <div className="booking-id">{booking.id}</div>

      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 20, lineHeight: 1.5 }}>
        {booking.confirmationMessage}
      </p>

      <div className="booking-details glass-card" style={{ padding: '16px' }}>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Service</span>
          <span className="booking-detail-value">{booking.service}</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Provider</span>
          <span className="booking-detail-value">{booking.provider.name}</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Location</span>
          <span className="booking-detail-value">{booking.location}</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Date</span>
          <span className="booking-detail-value">{booking.date}</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Time</span>
          <span className="booking-detail-value">{booking.time}</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Price Range</span>
          <span className="booking-detail-value">Rs. {booking.price}</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Distance</span>
          <span className="booking-detail-value">{booking.provider.distance} km</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Rating</span>
          <span className="booking-detail-value">{booking.provider.rating}★</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-label">Status</span>
          <span className="booking-detail-value" style={{ color: '#10b981' }}>
            ✓ {booking.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
