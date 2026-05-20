import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'Mujhe kal subah G-13 mein AC technician chahiye',
  'I need a plumber in F-10 urgently',
  'Bijli wala chahiye G-11 mein',
  'Tomorrow morning painter in I-8',
  'Darzi chahiye G-9 mein aaj',
];

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleExample = (example) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="search-container">
        <Search className="search-icon" size={18} />
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Describe what service you need..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {query.trim() && (
          <button type="submit" className="search-submit" aria-label="Search">
            <ArrowRight size={18} />
          </button>
        )}
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
        {EXAMPLE_QUERIES.map((ex, i) => (
          <button
            key={i}
            onClick={() => handleExample(ex)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              color: '#94a3b8',
              fontSize: '0.68rem',
              padding: '5px 10px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'rgba(16,185,129,0.3)';
              e.target.style.color = '#6ee7b7';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)';
              e.target.style.color = '#94a3b8';
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
