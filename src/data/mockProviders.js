// Mock Provider Database — 150+ providers across 10 categories in 17 areas
// Each provider has: id, name, category, location (sector + lat/lng), rating, pricePerHour, available, phone, experience, completedJobs

const SECTORS = {
  'G-6': { lat: 33.6900, lng: 72.9870 },
  'G-7': { lat: 33.6800, lng: 72.9930 },
  'G-8': { lat: 33.6730, lng: 72.9990 },
  'G-9': { lat: 33.6650, lng: 73.0050 },
  'G-10': { lat: 33.6580, lng: 73.0100 },
  'G-11': { lat: 33.6938, lng: 73.0182 },
  'G-13': { lat: 33.6320, lng: 73.0270 },
  'F-7': { lat: 33.7100, lng: 73.0050 },
  'F-8': { lat: 33.7000, lng: 73.0100 },
  'F-10': { lat: 33.6850, lng: 73.0200 },
  'F-11': { lat: 33.6780, lng: 73.0250 },
  'I-8': { lat: 33.6650, lng: 73.0700 },
  'I-10': { lat: 33.6450, lng: 73.0600 },
  'E-11': { lat: 33.7100, lng: 73.0300 },
  'DHA Phase 1': { lat: 33.5350, lng: 73.1100 },
  'DHA Phase 2': { lat: 33.5150, lng: 73.1200 },
  'Bahria Town': { lat: 33.5200, lng: 73.0900 },
  'Gulberg Islamabad': { lat: 33.6150, lng: 73.1600 },
  'Rawalpindi Saddar': { lat: 33.5850, lng: 73.0450 },
  'Chaklala': { lat: 33.5950, lng: 73.0850 }
};

export { SECTORS };

// Helper to generate providers
const generateProviders = (baseId, namePrefix, category, areas, countPerArea = 2) => {
  const ratings = [3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.7, 4.8, 4.9, 5.0];
  const prices = [500, 800, 1000, 1200, 1500, 1800, 2000, 2500];
  
  let providers = [];
  let idCounter = 1;
  
  for (const area of areas) {
    for (let i = 0; i < countPerArea; i++) {
      const isAvailable = Math.random() > 0.3; // 70% available
      const price = prices[Math.floor(Math.random() * prices.length)];
      
      providers.push({
        id: `${baseId}-${idCounter.toString().padStart(3, '0')}`,
        name: `${namePrefix} ${idCounter} (${area})`,
        category: category,
        sector: area,
        lat: SECTORS[area].lat + (Math.random() - 0.5) * 0.01,
        lng: SECTORS[area].lng + (Math.random() - 0.5) * 0.01,
        rating: ratings[Math.floor(Math.random() * ratings.length)],
        reviews: Math.floor(Math.random() * 500) + 10,
        phone: `0300-${Math.floor(1000000 + Math.random() * 9000000)}`,
        available: isAvailable,
        nextSlot: isAvailable ? `${Math.floor(Math.random() * 10 + 8)}:00 AM` : null,
        pricePerHour: price,
        price: `${price}-${price * 2}`, // Legacy format compat
        experience: `${Math.floor(Math.random() * 20) + 1} years`,
        completedJobs: Math.floor(Math.random() * 1000) + 50
      });
      idCounter++;
    }
  }
  return providers;
};

const allAreas = Object.keys(SECTORS);

const mockProviders = [
  ...generateProviders('ac', 'AC Tech Pro', 'AC Technician', allAreas),
  ...generateProviders('pl', 'Plumb Master', 'Plumber', allAreas),
  ...generateProviders('el', 'Spark Wire', 'Electrician', allAreas),
  ...generateProviders('pt', 'Color Splash', 'Painter', allAreas),
  ...generateProviders('cp', 'Wood Crafter', 'Carpenter', allAreas),
  ...generateProviders('bt', 'Glow Salon', 'Beautician', allAreas),
  ...generateProviders('tu', 'Edu Expert', 'Tutor', allAreas),
  ...generateProviders('cl', 'Spotless', 'Cleaner', allAreas),
  ...generateProviders('ms', 'Solid Build', 'Mason', allAreas),
  ...generateProviders('tl', 'Stitch Perfect', 'Tailor', allAreas)
];

export default mockProviders;
