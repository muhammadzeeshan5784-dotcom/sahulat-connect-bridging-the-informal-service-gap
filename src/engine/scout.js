// Agent B — Scout: Provider Discovery & Ranking
// Searches mock DB, calculates distance, ranks by composite score

import mockProviders from '../data/mockProviders.js';
import { SECTORS } from '../data/mockProviders.js';
import { haversineDistance, delay } from './tools.js';

export async function scoutAgent(intent, onEvent) {
  const { category, area } = intent;

  onEvent?.({ agent: 'scout', type: 'SEARCHING_PROVIDERS', message: `Querying provider database for ${category}...` });
  await delay(800);

  let exactMatches = [];
  let relaxedMatches = [];
  let isRelaxed = false;

  // Pass 1: Exact category match
  const categoryMatches = mockProviders.filter(p => p.category === category);
  
  // Filter by exact area if specified
  if (area && SECTORS[area]) {
      exactMatches = categoryMatches.filter(p => p.sector === area);
  } else {
      exactMatches = categoryMatches; // If no area specified, all category matches are exact
  }

  // Rank providers (by rating mostly since we aren't doing heavy distance logic if exact area matches)
  const rankProviders = (providers) => {
    return providers.map(p => {
      const ratingScore = (p.rating / 5.0) * 0.6;
      const reviewsScore = Math.min(p.reviews / 500, 1.0) * 0.2;
      const expScore = Math.min(parseInt(p.experience) / 10, 1.0) * 0.2;
      const composite = (ratingScore + reviewsScore + expScore) * 10;
      return { ...p, score: composite.toFixed(1) };
    }).sort((a, b) => b.score - a.score);
  };

  let finalProviders = rankProviders(exactMatches);

  // Pass 2: Relaxed search if no exact area matches found
  if (finalProviders.length === 0 && area && SECTORS[area]) {
      isRelaxed = true;
      const userLat = SECTORS[area].lat;
      const userLng = SECTORS[area].lng;
      
      // Get nearest providers of the same category
      relaxedMatches = categoryMatches.map(p => {
          const dist = haversineDistance(userLat, userLng, p.lat, p.lng);
          return { ...p, distance: dist };
      }).sort((a, b) => a.distance - b.distance).slice(0, 5); // Take top 5 closest
      
      finalProviders = rankProviders(relaxedMatches);
  }

  if (finalProviders.length > 0) {
      onEvent?.({
        agent: 'scout',
        type: 'PROVIDERS_FOUND',
        message: `Discovered ${finalProviders.length} providers`,
        data: { count: finalProviders.length, area, category, topRated: finalProviders[0].name }
      });
  }

  await delay(500);

  return {
    providers: finalProviders,
    relaxed: isRelaxed,
    reasoning: isRelaxed 
      ? `Could not find any ${category} specifically in ${area}, so I expanded the search to nearby sectors based on shortest physical distance.`
      : `Found ${finalProviders.length} highly rated ${category}s in ${area || 'your area'}. Ranked by a composite score of rating, completed jobs, and experience.`
  };
}
