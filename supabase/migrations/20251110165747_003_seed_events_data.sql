/*
  # Seed Data for Rutgers Chess Club Events
  
  ## Overview
  Comprehensive seed data with upcoming and past events featuring:
  - 4 upcoming events (tournaments and social events)
  - 6 past events with winners
  - Realistic chess event data
*/

-- Clear existing data
DELETE FROM winners;
DELETE FROM events;

-- UPCOMING EVENTS

INSERT INTO events (
  title, description, event_date, time_start, time_end, location,
  participants, rounds, rating, status, tags,
  registration_link, registration_label,
  info_link, info_label,
  resource_link, resource_label
) VALUES (
  'Spring 2025 Championship Tournament',
  'Our premier USCF-rated tournament of the spring semester. Open to all Rutgers students and community members. This 5-round Swiss system tournament will determine the Spring Champion. Pre-registration required. USCF membership recommended but not required for unrated players.',
  '2025-04-12',
  '10:00 AM',
  '6:00 PM',
  'Busch Student Center, Room 100',
  45,
  5,
  'USCF',
  'upcoming',
  ARRAY['tournament', 'uscf', 'championship'],
  'https://forms.gle/rutgers-spring-2025',
  'Register Now',
  'https://rutgerschess.com/spring-championship',
  'Tournament Details',
  'https://new.uschess.org/sites/default/files/media/documents/us-chess-rulebook-online-only-edition-v8-effective-january-1-2023.pdf',
  'USCF Rules'
);

INSERT INTO events (
  title, description, event_date, time_start, time_end, location,
  participants, rating, status, tags,
  registration_link, registration_label,
  resource_link, resource_label
) VALUES (
  'Beginner Chess Workshop',
  'Learn the fundamentals of chess! This workshop series covers opening principles, basic tactics, endgame fundamentals, and tournament etiquette. Perfect for beginners and those looking to refresh their skills. No prior experience necessary. All materials provided.',
  '2025-03-15',
  '7:00 PM',
  '9:00 PM',
  'Busch Student Center Food Court',
  30,
  'Casual',
  'upcoming',
  ARRAY['workshop', 'beginner', 'learning'],
  'https://forms.gle/beginner-workshop',
  'Sign Up Free',
  'https://www.chess.com/lessons',
  'Chess Lessons'
);

INSERT INTO events (
  title, description, event_date, time_start, time_end, location,
  participants, rounds, rating, status, tags,
  registration_link, registration_label
) VALUES (
  'Friday Night Blitz',
  'Fast-paced blitz tournament! 5 minute games, 7 rounds of Swiss pairings. Prizes for top 3 finishers. Great practice for quick thinking and time management. Drop-in welcome, but please arrive by 7:15 PM for pairings.',
  '2025-03-08',
  '7:00 PM',
  '10:00 PM',
  'Busch Student Center Food Court',
  25,
  7,
  'Casual',
  'upcoming',
  ARRAY['blitz', 'tournament', 'fast-paced'],
  'https://forms.gle/blitz-signup',
  'Join Tournament'
);

INSERT INTO events (
  title, description, event_date, time_start, time_end, location,
  is_recurring, status, tags,
  info_link, info_label
) VALUES (
  'Weekly Tuesday Meeting',
  'Our regular Tuesday meeting! Casual games, analysis, and friendly competition. All skill levels welcome. Bring your own set or use ours. Drop-in anytime between 7-9 PM.',
  '2025-03-11',
  '7:00 PM',
  '9:00 PM',
  'Busch Student Center Food Court',
  true,
  'upcoming',
  ARRAY['meeting', 'casual', 'recurring'],
  'https://rutgerschess.com/weekly-meetings',
  'Meeting Info'
);

-- PAST EVENTS

-- Fall 2024 Championship
WITH new_event AS (
  INSERT INTO events (
    title, description, event_date, time_start, time_end, location,
    participants, rounds, rating, status, tags,
    winners_image,
    info_link, info_label
  ) VALUES (
    'Fall 2024 Championship Tournament',
    'Intense 6-round Swiss tournament that determined our Fall champion. Over 40 participants competed in this USCF-rated event with a prize pool of $300.',
    '2024-11-16',
    '10:00 AM',
    '7:00 PM',
    'Busch Student Center, Room 100',
    42,
    6,
    'USCF',
    'past',
    ARRAY['tournament', 'uscf', 'championship'],
    'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1600',
    'https://rutgerschess.com/results/fall-2024',
    'Full Results & Photos'
  ) RETURNING id
)
INSERT INTO winners (event_id, place, name, score)
SELECT id, 1, 'Ansh Shah', '5.5/6' FROM new_event
UNION ALL
SELECT id, 2, 'Joaquin Carlson', '5.0/6' FROM new_event
UNION ALL
SELECT id, 3, 'Lev Zilbermintz', '5.0/6' FROM new_event;

-- Halloween Blitz 2024
WITH new_event AS (
  INSERT INTO events (
    title, description, event_date, time_start, time_end, location,
    participants, rounds, rating, status, tags,
    winners_image,
    info_link, info_label
  ) VALUES (
    'Halloween Blitz Tournament',
    'Costume-optional blitz tournament with spooky prizes! 8 rounds of 5-minute games with creative awards for best costume and most creative checkmates.',
    '2024-10-31',
    '7:00 PM',
    '10:00 PM',
    'Busch Student Center Food Court',
    28,
    8,
    'Casual',
    'past',
    ARRAY['blitz', 'social', 'halloween'],
    'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600',
    'https://rutgerschess.com/results/halloween-2024',
    'View Photos'
  ) RETURNING id
)
INSERT INTO winners (event_id, place, name, score)
SELECT id, 1, 'Aravind Kumar', '7.0/8' FROM new_event
UNION ALL
SELECT id, 2, 'Sarah Chen', '6.5/8' FROM new_event
UNION ALL
SELECT id, 3, 'Michael Rodriguez', '6.0/8' FROM new_event;

-- Spring 2024 Blitz
WITH new_event AS (
  INSERT INTO events (
    title, description, event_date, time_start, time_end, location,
    participants, rounds, rating, status, tags,
    winners_image
  ) VALUES (
    'Spring 2024 Blitz Tournament',
    'High-energy blitz event with 7 rounds of rapid-fire chess. Great turnout with 35 participants battling for glory!',
    '2024-04-19',
    '7:00 PM',
    '10:00 PM',
    'Busch Student Center Food Court',
    35,
    7,
    'Casual',
    'past',
    ARRAY['blitz', 'tournament'],
    'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1600'
  ) RETURNING id
)
INSERT INTO winners (event_id, place, name, score)
SELECT id, 1, 'Jatin Thakkar', '6.5/7' FROM new_event
UNION ALL
SELECT id, 2, 'Ansh Shah', '6.0/7' FROM new_event
UNION ALL
SELECT id, 3, 'Emma Watson', '5.5/7' FROM new_event;

-- US Amateur Team East 2024
INSERT INTO events (
  title, description, event_date, time_start, time_end, location,
  participants, rounds, rating, status, tags,
  info_link, info_label
) VALUES (
  'US Amateur Team East 2024',
  'Rutgers Chess Club sent 3 teams to compete at the prestigious US Amateur Team East championship in Parsippany, NJ. Our top team finished in the top 20 out of 150+ teams!',
  '2024-02-17',
  '9:00 AM',
  '6:00 PM',
  'Parsippany Hilton',
  12,
  6,
  'USCF',
  'past',
  ARRAY['tournament', 'uscf', 'team-event'],
  'https://www.njscf.org/usate',
  'Official Results'
);

-- Winter 2024 Rapid
WITH new_event AS (
  INSERT INTO events (
    title, description, event_date, time_start, time_end, location,
    participants, rounds, rating, status, tags,
    winners_image
  ) VALUES (
    'Winter 2024 Rapid Chess Tournament',
    'Our first rapid tournament of 2024! 15+10 time control, 5 rounds Swiss. Competitive field with strong performances all around.',
    '2024-01-26',
    '6:00 PM',
    '11:00 PM',
    'Busch Student Center, Room 100',
    30,
    5,
    'USCF',
    'past',
    ARRAY['rapid', 'tournament', 'uscf'],
    'https://images.unsplash.com/photo-1551967919-320cfb1e3f92?w=1600'
  ) RETURNING id
)
INSERT INTO winners (event_id, place, name, score)
SELECT id, 1, 'David Kim', '4.5/5' FROM new_event
UNION ALL
SELECT id, 2, 'Lev Zilbermintz', '4.0/5' FROM new_event
UNION ALL
SELECT id, 3, 'Joaquin Carlson', '4.0/5' FROM new_event;

-- Fall 2023 Blitz Championship
WITH new_event AS (
  INSERT INTO events (
    title, description, event_date, time_start, time_end, location,
    participants, rounds, rating, status, tags,
    winners_image
  ) VALUES (
    'Fall 2023 Blitz Championship',
    'Epic blitz showdown to close out the fall semester. Record 50 participants made this our biggest event of the year!',
    '2023-12-08',
    '7:00 PM',
    '11:00 PM',
    'Busch Student Center Food Court',
    50,
    7,
    'Casual',
    'past',
    ARRAY['blitz', 'championship'],
    'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=1600'
  ) RETURNING id
)
INSERT INTO winners (event_id, place, name, score)
SELECT id, 1, 'Ansh Shah', '6.5/7' FROM new_event
UNION ALL
SELECT id, 2, 'Aravind Kumar', '6.0/7' FROM new_event
UNION ALL
SELECT id, 3, 'Jatin Thakkar', '6.0/7' FROM new_event;
