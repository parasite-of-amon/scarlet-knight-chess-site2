# Local Database Implementation

This project uses a local SQLite database (via sql.js) to store all event information. The database is stored in the browser's localStorage, making it completely local to each user's browser.

## Database Structure

### Tables

1. **upcoming_events**
   - `id` - Primary key
   - `title` - Event title
   - `date` - Event date
   - `time` - Event time
   - `location` - Event location
   - `description` - Event description
   - `is_recurring` - Boolean for recurring events
   - `recurrence_pattern` - Pattern description (e.g., "weekly_tuesday")
   - `created_at` - Timestamp
   - `updated_at` - Timestamp

2. **past_events**
   - `id` - Primary key
   - `title` - Event title
   - `date` - Event date
   - `participants` - Number/description of participants
   - `rounds` - Number of rounds
   - `rating` - Rating type (e.g., "USCF Rated")
   - `description` - Event description
   - `created_at` - Timestamp
   - `updated_at` - Timestamp

3. **past_event_winners**
   - `id` - Primary key
   - `past_event_id` - Foreign key to past_events
   - `place` - Winner's place (e.g., "1st", "2nd")
   - `name` - Winner's name
   - `score` - Winner's score

4. **calendar_events**
   - `id` - Primary key
   - `title` - Event title
   - `date` - Event date
   - `time` - Event time
   - `location` - Event location
   - `description` - Event description
   - `event_type` - Type: 'meeting', 'tournament', 'social', 'deadline'
   - `color_code` - Color for display (e.g., "green", "blue")
   - `is_recurring` - Boolean for recurring events
   - `recurrence_pattern` - Pattern description
   - `created_at` - Timestamp
   - `updated_at` - Timestamp

## How It Works

1. **Database Initialization**: The database is automatically initialized when the Events page loads for the first time.

2. **Data Storage**: All data is stored in the browser's localStorage under the key 'eventsDatabase'. This means:
   - Data persists between page reloads
   - Data is local to each browser/device
   - No server or external database required

3. **Seeding**: On first load, if no data exists, the database is automatically seeded with sample event data.

## Adding, Editing, or Deleting Events

To manage events, you can use the functions exported from `src/lib/eventsService.ts`:

### Adding Events

```typescript
import { addUpcomingEvent, addPastEvent, addCalendarEvent } from '@/lib/eventsService';

// Add an upcoming event
addUpcomingEvent({
  title: "Chess Tournament",
  date: "March 15, 2024",
  time: "2:00 PM - 6:00 PM",
  location: "Main Hall",
  description: "Annual spring tournament"
});

// Add a past event with winners
addPastEvent({
  title: "Winter Tournament 2023",
  date: "December 10, 2023",
  participants: "20 participants",
  rounds: "6 rounds",
  rating: "USCF Rated",
  winners: [
    { place: "1st", name: "John Doe", score: "6-0" },
    { place: "2nd", name: "Jane Smith", score: "5-1" }
  ]
});
```

### Retrieving Events

```typescript
import { getUpcomingEvents, getPastEvents, getCalendarEvents } from '@/lib/eventsService';

const upcoming = getUpcomingEvents();
const past = getPastEvents(); // Includes winners automatically
const calendar = getCalendarEvents();
```

### Deleting Events

```typescript
import { deleteUpcomingEvent, deletePastEvent, deleteCalendarEvent } from '@/lib/eventsService';

deleteUpcomingEvent(1); // Delete by ID
```

### Updating Events

```typescript
import { updateUpcomingEvent } from '@/lib/eventsService';

updateUpcomingEvent(1, {
  title: "Updated Title",
  location: "New Location"
});
```

## Resetting the Database

To clear all data and start fresh, open the browser console and run:

```javascript
localStorage.removeItem('eventsDatabase');
```

Then reload the page. The database will be re-initialized with the seed data.

## Technical Details

- **Library**: sql.js (SQLite compiled to WebAssembly)
- **Storage**: Browser localStorage
- **File Location**: The database logic is in `src/lib/db.ts`
- **Service Layer**: Event operations are in `src/lib/eventsService.ts`
- **Seed Data**: Initial data is defined in `src/lib/seedData.ts`

## Backup and Export

Since the database is stored in localStorage, you can export it by:

1. Opening browser DevTools
2. Going to Application > Local Storage
3. Finding the 'eventsDatabase' key
4. Copying its value

To restore, paste the value back into localStorage under the same key and reload the page.
