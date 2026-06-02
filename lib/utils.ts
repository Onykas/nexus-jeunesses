export function generateICalendar(data: {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NEXUS JEUNESSES//NEXUS SPECTACLE//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:nexus-spectacle-2026@nexusjeunesses.org`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(data.startDate)}`,
    `DTEND:${fmt(data.endDate)}`,
    `SUMMARY:${data.title}`,
    `DESCRIPTION:${data.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${data.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function sanitizeInput(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function rateLimit(map: Map<string, { count: number; ts: number }>, ip: string, limit = 10): boolean {
  const now = Date.now();
  const entry = map.get(ip);
  if (!entry || now - entry.ts > 86_400_000) {
    map.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
