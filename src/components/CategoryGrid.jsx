const CATEGORIES = [
  { id: 'ac', label: 'AC Technician', icon: '❄️', query: 'AC Technician chahiye' },
  { id: 'plumber', label: 'Plumber', icon: '🔧', query: 'Plumber chahiye' },
  { id: 'electrician', label: 'Electrician', icon: '⚡', query: 'Electrician chahiye' },
  { id: 'painter', label: 'Painter', icon: '🎨', query: 'Painter chahiye' },
  { id: 'carpenter', label: 'Carpenter', icon: '🪚', query: 'Carpenter chahiye' },
  { id: 'beautician', label: 'Beautician', icon: '💄', query: 'Beautician chahiye' },
  { id: 'tutor', label: 'Tutor', icon: '📚', query: 'Tutor chahiye' },
  { id: 'cleaner', label: 'Cleaner', icon: '🧹', query: 'Cleaner chahiye' },
  { id: 'mason', label: 'Mason', icon: '🧱', query: 'Mason chahiye' },
  { id: 'tailor', label: 'Tailor', icon: '✂️', query: 'Tailor chahiye' },
];

export default function CategoryGrid({ onSelect }) {
  return (
    <div style={{ marginTop: 24 }}>
      <p className="section-label">Browse Categories</p>
      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="glass-card category-card"
            onClick={() => onSelect(cat.query)}
            aria-label={cat.label}
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit' }}
          >
            <div className="category-icon">{cat.icon}</div>
            <span className="category-label">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
