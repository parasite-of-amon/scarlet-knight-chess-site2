export function parseEventDate(dateString: string): Date | null {
  const trimmed = dateString.trim();

  if (trimmed.toLowerCase().startsWith('every ')) {
    return null;
  }

  const monthNames = {
    'january': 0, 'jan': 0,
    'february': 1, 'feb': 1,
    'march': 2, 'mar': 2,
    'april': 3, 'apr': 3,
    'may': 4,
    'june': 5, 'jun': 5,
    'july': 6, 'jul': 6,
    'august': 7, 'aug': 7,
    'september': 8, 'sep': 8, 'sept': 8,
    'october': 9, 'oct': 9,
    'november': 10, 'nov': 10,
    'december': 11, 'dec': 11
  };

  const monthDayYearPattern = /^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/i;
  const match = trimmed.match(monthDayYearPattern);
  if (match) {
    const monthStr = match[1].toLowerCase();
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const monthIndex = monthNames[monthStr as keyof typeof monthNames];
    if (monthIndex !== undefined && !isNaN(day) && !isNaN(year)) {
      const date = new Date(year, monthIndex, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  const slashPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const slashMatch = trimmed.match(slashPattern);
  if (slashMatch) {
    const month = parseInt(slashMatch[1], 10);
    const day = parseInt(slashMatch[2], 10);
    const year = parseInt(slashMatch[3], 10);

    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const isoMatch = trimmed.match(isoPattern);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);

    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  try {
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    return null;
  }

  return null;
}

export function isRecurringEvent(dateString: string): boolean {
  const trimmed = dateString.trim().toLowerCase();

  if (trimmed.startsWith('every ')) {
    return true;
  }

  const recurringKeywords = ['weekly', 'daily', 'monthly', 'yearly', 'recurring'];
  return recurringKeywords.some(keyword => trimmed.includes(keyword));
}

export function categorizeEventByDate(dateString: string, isRecurring: boolean = false): 'upcoming' | 'past' {
  if (isRecurring || isRecurringEvent(dateString)) {
    return 'upcoming';
  }

  const eventDate = parseEventDate(dateString);
  if (!eventDate) {
    return 'upcoming';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  return eventDate < today ? 'past' : 'upcoming';
}
