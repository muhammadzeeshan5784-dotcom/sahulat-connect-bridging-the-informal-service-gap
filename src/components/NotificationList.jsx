import { motion } from 'framer-motion';

export default function NotificationList({ notifications }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <p className="section-label">📬 Scheduled Follow-Ups</p>
      {notifications.map((notif, i) => (
        <motion.div
          key={notif.id}
          className="glass-card notif-item"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <div className="notif-icon">{notif.icon}</div>
          <div className="notif-content">
            <div className="notif-title">{notif.title}</div>
            <div className="notif-message">{notif.message}</div>
            <div className="notif-time">
              ⏱ {notif.scheduledFor} • To: {notif.target}
            </div>
          </div>
          <span className={`notif-status notif-status-${notif.status}`}>
            {notif.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
