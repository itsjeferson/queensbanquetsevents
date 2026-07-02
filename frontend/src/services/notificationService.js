import { api } from './api';
import { eventService, guestMessageService, rsvpService } from './invitationService';

function formatRsvp(row) {
  const name = (row.name || '').trim() || 'A guest';
  const eventName = (row.event_name || '').trim() || 'your event';
  const attendance = row.attendance || 'yes';

  let message;
  if (attendance === 'no') {
    message = `${name} declined attendance for ${eventName}.`;
  } else if (attendance === 'maybe') {
    message = `${name} responded maybe for ${eventName}.`;
  } else {
    message = `${name} confirmed attendance for ${eventName}.`;
  }

  return {
    id: `rsvp-${row.id}`,
    type: 'rsvp',
    title: 'New RSVP response',
    message,
    created_at: row.submitted_at,
    event_id: row.event_id,
    event_name: eventName,
  };
}

function formatGuestMessage(row, eventName) {
  const guestName = (row.guest_name || '').trim() || 'A guest';
  const invitationName = (eventName || '').trim() || 'your invitation';

  return {
    id: `message-${row.id}`,
    type: 'guest_message',
    title: 'Guest message',
    message: `${guestName} left a message on ${invitationName}.`,
    created_at: row.created_at,
    event_id: row.event_id,
    event_name: invitationName,
  };
}

async function buildFromExistingEndpoints(clientId) {
  const [rsvpRes, eventsRes] = await Promise.all([
    rsvpService.getByClient(clientId),
    eventService.getAll(clientId),
  ]);

  const rsvps = rsvpRes.data?.rsvps ?? [];
  const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];

  const messageLists = await Promise.all(
    events.map(async (event) => {
      try {
        const res = await guestMessageService.getByEvent(event.id);
        const messages = Array.isArray(res.data) ? res.data : [];
        return messages.map((message) => formatGuestMessage(
          { ...message, event_id: event.id },
          event.event_name,
        ));
      } catch {
        return [];
      }
    }),
  );

  const notifications = [
    ...rsvps.map(formatRsvp),
    ...messageLists.flat(),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    success: true,
    data: { notifications: notifications.slice(0, 50) },
  };
}

export const notificationService = {
  async getByClient(clientId) {
    try {
      const res = await api.get(`/notifications/client/${clientId}`);
      const list = res.data?.notifications;
      if (Array.isArray(list)) {
        return res;
      }
    } catch {
      // Dedicated feed unavailable — build from existing endpoints.
    }

    return buildFromExistingEndpoints(clientId);
  },
};
