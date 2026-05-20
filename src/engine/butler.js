// Agent D — Butler: Follow-Up Automation
// Schedules reminders, status updates, and feedback collection

import { generateNotifId, delay } from './tools.js';

/**
 * Agent D: Butler
 * Schedules follow-up actions after booking
 * @param {Object} booking - Confirmed booking object
 * @param {Function} onEvent - Callback for event log
 * @returns {{ notifications: Array }}
 */
export async function butlerAgent(booking, onEvent) {
  if (!booking) {
    onEvent?.({ agent: 'butler', type: 'NO_BOOKING', message: 'No booking to follow up on — skipping.' });
    return { notifications: [] };
  }

  onEvent?.({ agent: 'butler', type: 'SCHEDULING_REMINDERS', message: 'Setting up automated follow-up workflow...' });
  await delay(500);

  const notifications = [];

  // 1. Immediate confirmation to user
  notifications.push({
    id: generateNotifId(),
    type: 'confirmation',
    target: 'user',
    title: 'Booking Confirmed ✓',
    message: booking.confirmationMessage,
    scheduledFor: 'Now',
    icon: '✅',
    status: 'sent',
  });

  onEvent?.({ agent: 'butler', type: 'CONFIRMATION_SENT', message: 'Confirmation notification sent to user' });
  await delay(300);

  // 2. Provider notification (immediate)
  notifications.push({
    id: generateNotifId(),
    type: 'provider_alert',
    target: 'provider',
    title: 'New Booking Request',
    message: `New ${booking.service} request at ${booking.location}. Booking: ${booking.id}. Time: ${booking.date} at ${booking.time}.`,
    scheduledFor: 'Now',
    icon: '📋',
    status: 'sent',
  });

  onEvent?.({ agent: 'butler', type: 'PROVIDER_NOTIFIED', message: `Provider ${booking.provider.name} notified of new booking` });
  await delay(300);

  // 3. User reminder — 1 hour before
  notifications.push({
    id: generateNotifId(),
    type: 'reminder',
    target: 'user',
    title: 'Upcoming Appointment',
    message: `Reminder: Your ${booking.service} appointment with ${booking.provider.name} is in 1 hour at ${booking.time}.`,
    scheduledFor: '1 hour before appointment',
    icon: '⏰',
    status: 'scheduled',
  });

  // 4. Provider reminder — 2 hours before
  notifications.push({
    id: generateNotifId(),
    type: 'reminder',
    target: 'provider',
    title: 'Upcoming Job',
    message: `Reminder: You have a ${booking.service} job at ${booking.location} in 2 hours.`,
    scheduledFor: '2 hours before appointment',
    icon: '🔔',
    status: 'scheduled',
  });

  onEvent?.({ agent: 'butler', type: 'REMINDERS_SCHEDULED', message: 'Scheduled reminders: User (-1hr), Provider (-2hr)' });
  await delay(300);

  // 5. Feedback request — 2 hours after completion
  notifications.push({
    id: generateNotifId(),
    type: 'feedback',
    target: 'user',
    title: 'Rate Your Experience',
    message: `How was your experience with ${booking.provider.name}? Tap to rate and help others!`,
    scheduledFor: '2 hours after appointment',
    icon: '⭐',
    status: 'scheduled',
  });

  // 6. Status update — when provider is en route (simulated)
  notifications.push({
    id: generateNotifId(),
    type: 'status_update',
    target: 'user',
    title: 'Provider En Route',
    message: `${booking.provider.name} is on the way to ${booking.location}. ETA: 15 minutes.`,
    scheduledFor: '30 minutes before appointment',
    icon: '🚗',
    status: 'scheduled',
  });

  onEvent?.({
    agent: 'butler',
    type: 'FOLLOW_UP_COMPLETE',
    message: `All ${notifications.length} follow-up actions configured — confirmation, reminders, status updates, and feedback`,
    data: { totalNotifications: notifications.length },
  });

  return { notifications };
}
