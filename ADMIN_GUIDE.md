# Admin Guide - Rutgers Chess Club Website

## Admin Authentication

The website includes a comprehensive admin authentication system with full CRUD capabilities for managing content.

### Admin Credentials

- **Username:** `administrator`
- **Password:** `RutgersChess@123`

### Accessing Admin Dashboard

1. Navigate to `/admin` route or click the "Admin Login" button in the footer
2. Enter the credentials above
3. You will be redirected to the admin dashboard with full management capabilities

## Features Implemented

### 1. Admin Authentication System
- Secure login with bcrypt password hashing
- Session-based authentication using express-session
- Protected routes requiring admin authentication
- Logout functionality

### 2. Database Integration
- **Supabase PostgreSQL Database** for all data storage
- Automatic synchronization across the entire website
- Real-time updates when admins make changes
- Proper Row Level Security (RLS) policies

### 3. Event Management System

#### Event Modal Features
- **Title** - Event name
- **Description** - Detailed event information
- **Date** - Event date (supports standard date formats)
- **Time** - Event time
- **Location** - Event venue
- **Custom Links** - Add multiple links with titles (e.g., "Register Here", "View Results")
- **Recurring Events** - Mark events as recurring (always appear in upcoming)

#### Automatic Event Categorization
The system automatically categorizes events based on date logic:

- **Upcoming Events:**
  - Events with dates on or after the current date
  - ALL recurring events (regardless of date)

- **Past Events:**
  - Events with dates before the current date
  - Recurring events are NEVER categorized as past events

- **Calendar:** Shows all events (both past and upcoming)

### 4. Content Management Areas

#### Available Management Sections:
- ✅ Events (Past, Upcoming, Calendar)
- ✅ Sponsors
- ✅ About Page Content
- ✅ Navigation Management

### 5. Navigation Structure

The navigation has been reordered as requested:
- Home
- About
- **Events** (Dropdown: Past Events, Upcoming Events, Calendar)
- Resources
- Sponsors
- Contact
- Join Us

## Testing Performed

### Database Operations
- ✅ Created 5 sample events (3 upcoming, 2 past, 1 recurring)
- ✅ Created 5 sample sponsors (different tiers)
- ✅ Created 3 about page content sections
- ✅ Verified admin user creation with secure password hashing

### Event Categorization Testing
- ✅ Past events (dates before today) appear only in Past Events
- ✅ Upcoming events (dates on/after today) appear in Upcoming Events
- ✅ Recurring events ALWAYS appear in Upcoming Events
- ✅ All events appear in Calendar view
- ✅ Date comparison logic works correctly

### CRUD Operations Testing
- ✅ Create new events through admin dashboard
- ✅ Read/view all events in admin dashboard
- ✅ Update existing events with edit button
- ✅ Delete events with confirmation dialog
- ✅ Changes reflect immediately across all pages

### Authentication Testing
- ✅ Login with valid credentials succeeds
- ✅ Login with invalid credentials fails
- ✅ Protected routes redirect to login
- ✅ Session persists across page refreshes
- ✅ Logout clears session correctly

## Sample Data Included

### Events
1. **Weekly Chess Club Meeting** (Recurring)
   - Location: Busch Student Center - Food Court
   - Time: 7:00 PM - 9:00 PM
   - Categorized as: Upcoming

2. **Spring 2025 Blitz Tournament** (Future Date)
   - Location: Busch Student Center
   - Time: 2:00 PM - 6:00 PM
   - Custom Link: Tournament Results
   - Categorized as: Upcoming

3. **Fall 2025 Championship** (Future Date)
   - Location: College Avenue Student Center
   - Custom Links: Register Here, Tournament Rules
   - Categorized as: Upcoming

4. **Beginner Chess Workshop** (Past Date)
   - Date: September 15, 2024
   - Categorized as: Past

5. **Chess Simultaneous Exhibition** (Past Date)
   - Date: August 20, 2024
   - Custom Link: Player Profile
   - Categorized as: Past

### Sponsors
1. Rutgers University (Platinum)
2. Chess.com (Gold)
3. US Chess Federation (Gold)
4. Local Chess Shop (Silver)
5. Student Activities (Bronze)

### About Page Content
- Mission Statement
- History Section
- Activities Description

## API Endpoints

All endpoints require admin authentication (except GET requests):

### Events
- `GET /api/events/unified` - Get all events
- `POST /api/events/unified` - Create new event
- `PATCH /api/events/unified/:id` - Update event
- `DELETE /api/events/unified/:id` - Delete event
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/past` - Get past events
- `GET /api/events/calendar` - Get calendar events

### Sponsors
- `GET /api/sponsors` - Get all sponsors
- `POST /api/sponsors` - Create new sponsor
- `PATCH /api/sponsors/:id` - Update sponsor
- `DELETE /api/sponsors/:id` - Delete sponsor

### About Content
- `GET /api/about-content` - Get all about content
- `GET /api/about-content/:section` - Get specific section
- `POST /api/about-content` - Create/update content
- `PATCH /api/about-content/:id` - Update content

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check auth status

## Technical Implementation

### Technology Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, Node.js
- **Database:** Supabase PostgreSQL
- **Authentication:** bcrypt, express-session
- **State Management:** TanStack Query (React Query)

### Security Features
- Passwords hashed with bcrypt (10 salt rounds)
- Session-based authentication with secure cookies
- Row Level Security (RLS) enabled on all tables
- Protected API endpoints requiring authentication
- SQL injection prevention through parameterized queries

### Date Handling
- Proper date parsing and comparison
- Timezone-aware date handling
- Support for multiple date formats
- Automatic categorization based on current date

## Future Enhancements

Potential additions for future development:
- Image upload functionality for events
- Bulk event operations
- Event search and filtering
- Email notifications for new events
- Member management system
- Tournament bracket generator
- Rating system integration

## Support

For issues or questions:
- Check the database connection in `.env`
- Verify Supabase credentials are correct
- Check browser console for client-side errors
- Check server logs for backend errors
- Ensure all npm packages are installed

## Build Information

Project successfully built with Vite.
All TypeScript type checking passed.
No compilation errors detected.
