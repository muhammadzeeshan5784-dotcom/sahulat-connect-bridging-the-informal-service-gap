// Engine Utility Functions

/**
 * Haversine formula — calculates distance in km between two lat/lng points
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(1);
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Generate unique booking ID like BK-2026-0001
 */
let bookingCounter = 0;
export function generateBookingId() {
  bookingCounter++;
  const year = new Date().getFullYear();
  return `BK-${year}-${String(bookingCounter).padStart(4, '0')}`;
}

/**
 * Generate a unique notification ID
 */
let notifCounter = 0;
export function generateNotifId() {
  notifCounter++;
  return `NF-${String(notifCounter).padStart(4, '0')}`;
}

/**
 * Format a Date to readable time string
 */
export function formatTime(date) {
  return date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Format a Date to readable date string
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Get tomorrow's date at a given hour
 */
export function getTomorrowAt(hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/**
 * Delay helper for simulating agent "thinking" time
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize proximity score: closer = higher score (0-5 scale, max 10km)
 */
export function proximityScore(distanceKm) {
  if (distanceKm <= 0) return 5;
  if (distanceKm >= 10) return 0;
  return +((1 - distanceKm / 10) * 5).toFixed(2);
}
