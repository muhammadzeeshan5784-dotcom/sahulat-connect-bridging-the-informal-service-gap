// Agent C — Negotiator: Booking Simulation
// Simulates slot verification, booking confirmation, and receipt generation

import { generateBookingId, getTomorrowAt, formatTime, formatDate, delay } from './tools.js';

/**
 * Agent C: Negotiator
 * Simulates end-to-end booking process
 * @param {Object} provider - Selected provider object
 * @param {{ service_type, location, time }} intent - Extracted intent
 * @param {Function} onEvent - Callback for event log
 * @returns {{ booking }}
 */
export async function negotiatorAgent(provider, intent, onEvent) {
  onEvent?.({ agent: 'negotiator', type: 'CHECKING_AVAILABILITY', message: `Checking availability for ${provider.name}...` });
  await delay(600);

  // Simulate availability check
  if (!provider.available) {
    onEvent?.({ agent: 'negotiator', type: 'PROVIDER_UNAVAILABLE', message: `${provider.name} is currently unavailable — would need to try next provider` });
    return {
      booking: null,
      success: false,
      reason: `${provider.name} is not available at this time.`,
    };
  }

  onEvent?.({ agent: 'negotiator', type: 'SLOT_AVAILABLE', message: `${provider.name} has slot available: ${provider.nextSlot}` });
  await delay(400);

  // Determine booking time
  const bookingDate = intent.time?.toLowerCase().includes('tomorrow') ? getTomorrowAt(10) : new Date();
  const slotTime = provider.nextSlot || '10:00 AM';

  // Generate booking
  const bookingId = generateBookingId();
  onEvent?.({ agent: 'negotiator', type: 'GENERATING_BOOKING', message: `Creating booking ${bookingId}...` });
  await delay(500);

  const booking = {
    id: bookingId,
    provider: {
      id: provider.id,
      name: provider.name,
      phone: provider.phone,
      category: provider.category,
      rating: provider.rating,
      sector: provider.sector,
      distance: provider.distance,
    },
    service: intent.service_type,
    location: intent.location,
    date: formatDate(bookingDate),
    time: slotTime,
    status: 'confirmed',
    price: provider.price,
    createdAt: new Date().toISOString(),
    confirmationMessage: `Your ${intent.service_type} booking with ${provider.name} is confirmed for ${formatDate(bookingDate)} at ${slotTime}. Booking ID: ${bookingId}`,
  };

  onEvent?.({
    agent: 'negotiator',
    type: 'BOOKING_CONFIRMED',
    message: `Booking confirmed! ${bookingId} — ${provider.name} on ${booking.date} at ${slotTime}`,
    data: { bookingId, provider: provider.name, date: booking.date, time: slotTime },
  });

  return { booking, success: true };
}
