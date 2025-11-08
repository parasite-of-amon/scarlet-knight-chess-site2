# Rutgers University Chess Club Website

## Overview

This is a full-stack web application for the Rutgers University Chess Club built with React, TypeScript, and Express. The application serves as a comprehensive platform for managing club activities, displaying events, and facilitating member engagement. It features a modern, responsive UI built with shadcn/ui components and uses in-memory storage (MemStorage) for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## Critical Configuration Notes

**IMPORTANT: Tailwind CSS Configuration**
The `tailwind.config.ts` file MUST have the correct content paths to scan for CSS classes:
```typescript
content: ["./client/src/**/*.{ts,tsx}", "./client/index.html"]
```
Do NOT change these paths to `./src/**` or `./pages/**` as this will break CSS generation. The paths must point to the actual location of source files in the `client/` directory.

**IMPORTANT: Vite Server Configuration**
The `vite.config.ts` file MUST have these server settings for Replit environment:
```typescript
server: {
  port: 5000,
  host: "0.0.0.0",
  allowedHosts: true,
}
```
Do NOT use specific domain names in `allowedHosts` as Replit URLs change. Always use `allowedHosts: true`.

**Migration History:**
- October 2025: Migrated from Lovable frontend-only to Replit fullstack template
- Replaced React Router with wouter for routing
- Replaced client-side SQL.js database with Express backend + MemStorage
- Fixed esbuild deadlock by updating dev script to ignore Vite timestamp files

**Recent Changes (October 31, 2025):**
- **Unified Admin System Implementation:**
  - Implemented session-based authentication with admin login (username: admin, password: RutgersChessClub@123)
  - Created unified event schema and API endpoint (`/api/events/unified`) consolidating all event types
  - Built comprehensive UnifiedEventModal supporting all event fields (title, date, location, time, description, images, recurring, participants, rounds, rating, winners)
  - Migrated all three event pages (Past, Upcoming, Calendar) to fetch from unified endpoint with smart client-side filtering
  - Added conditional CRUD buttons visible only to admin users across all event pages
  - Implemented editable About page with three sections (intro, history, team) supporting text and image uploads
  - Built Sponsors page with full CRUD and PDF flyer upload/viewer
  - **Critical Bug Fixes:**
    - Added Zod validation to all PATCH endpoints preventing malformed data persistence
    - Removed unused CreateEventModal and EditEventModal components (reduced LSP errors from 1181 to 811)
    - Fixed Events.tsx import errors causing blank page
  - **Smart Event Categorization Logic:**
    - Backend automatically categorizes events based on date and recurring status
    - Past Events: date < today AND NOT recurring
    - Upcoming Events: date >= today OR recurring
    - Calendar: shows all events with color-coding by type

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for data fetching and state management
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom theme configuration

**Design Decisions:**
- **Component-based architecture**: The application uses a modular component structure with reusable UI components from shadcn/ui
- **Client-side routing**: Wouter provides lightweight routing without the overhead of React Router
- **Form management**: React Hook Form with Zod validation for type-safe form handling
- **State management**: TanStack Query manages server state, eliminating the need for Redux or similar libraries
- **Styling approach**: Utility-first CSS with Tailwind, extended with custom color schemes and typography (Playfair Display for headings, Inter for body text)

**Key Features:**
- Multi-page application with Home, About, Events, Membership, Resources, Sponsors, and Contact pages
- **Events Navigation System**:
  - Dropdown navigation menu with three options (Past Events, Upcoming Events, Calendar)
  - Past Events page with tournament history and achievements
  - Upcoming Events page with chronological list and modal popups
  - Calendar page with monthly view and CRUD functionality for all event types
- Event management system with create, edit, and delete capabilities
- Image carousel component for event galleries
- Dark mode support via next-themes
- SEO optimization with structured data (JSON-LD) and meta tags
- Responsive design for mobile and desktop

### Backend Architecture

**Technology Stack:**
- Node.js with Express
- TypeScript for type safety
- In-memory storage with localStorage persistence

**Design Decisions:**
- **Minimal server setup**: Express server primarily serves the Vite-built frontend and provides API endpoints
- **Development middleware**: Vite's middleware mode in development for hot module replacement
- **RESTful API**: Simple REST endpoints for CRUD operations on events
- **Type sharing**: Shared types between client and server via the `@shared` directory
- **Request logging**: Custom middleware for API request/response logging in development

**API Structure:**
- `GET /api/events/upcoming` - Fetch upcoming events
- `GET /api/events/past` - Fetch past events with winners
- `GET /api/events/calendar` - Fetch calendar events
- `POST /api/events/upcoming` - Create upcoming event
- `POST /api/events/past` - Create past event with winners
- `POST /api/events/calendar` - Create calendar event
- Update and delete endpoints (referenced but not shown in routes.ts)

### Data Storage

**Storage Solution:**
- In-memory storage implementation (`MemStorage` class)
- Browser's localStorage for client-side persistence (mentioned in DATABASE.md)
- SQLite via sql.js (intended, as mentioned in DATABASE.md)

**Schema Design:**
The application uses Drizzle ORM with PostgreSQL schema definitions (note: currently using PostgreSQL schema syntax, but DATABASE.md indicates SQLite is the intended database):

1. **upcoming_events**: Stores future chess club events with optional recurring patterns
2. **past_events**: Archives completed events with participant information
3. **past_event_winners**: Stores tournament results and winner details
4. **calendar_events**: General calendar entries with event types (meeting, tournament, social, deadline)

**Design Rationale:**
- Separation of event types (upcoming vs. past) allows for different data structures and queries
- Recurring event support via `is_recurring` and `recurrence_pattern` fields
- Image support through `imagePaths` text field (stores comma-separated or JSON array of paths)
- Zod schemas generated from Drizzle schemas ensure type safety across the stack

### Image Management

**Image Handling:**
- Client-side image compression using HTML5 Canvas API
- Configurable compression options (max dimensions, quality)
- Generated image paths follow pattern: `/events/images/{eventType}/{timestamp}_{randomId}_{filename}.{ext}`
- Images stored as base64 data URLs in the application

**Design Rationale:**
- Client-side compression reduces bandwidth and storage requirements
- Organized file structure by event type for better maintainability
- Random ID generation prevents filename collisions

### Authentication & Authorization

**Current State:**
- No authentication system implemented
- Comments in code reference "admin" functionality for editing content
- Placeholder for future admin/user role implementation

### Form Validation

**Validation Strategy:**
- Zod schemas defined in shared directory for consistency
- `drizzle-zod` generates insert schemas from database schemas
- React Hook Form with `@hookform/resolvers` integrates Zod validation
- Client-side validation before API calls

## External Dependencies

### UI Component Libraries
- **@radix-ui/***: Unstyled, accessible UI primitives (accordion, dialog, dropdown, etc.)
- **shadcn/ui**: Pre-built components using Radix UI
- **lucide-react**: Icon library
- **class-variance-authority**: Utility for managing component variants
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel/slider functionality
- **input-otp**: OTP input component
- **vaul**: Drawer component

### Data Management
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: TypeScript ORM
- **drizzle-zod**: Zod schema generation from Drizzle schemas
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx** & **tailwind-merge**: Conditional className utilities
- **next-themes**: Theme management (dark/light mode)

### Development Dependencies
- **TypeScript**: Type safety across the application
- **Vite**: Fast development server and build tool
- **@vitejs/plugin-react-swc**: React plugin with SWC compiler
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Tailwind CSS**: Utility-first CSS framework
- **tsx**: TypeScript execution for Node.js

### External Services
- **Chess.com**: Integration for online play (referenced in UI, actual API integration not visible)
- **USCF (United States Chess Federation)**: Tournament rating system (referenced in UI)
- **Rutgers getINVOLVED**: Official club registration platform (referenced in membership page)

### Build & Deployment
- **Express**: Production server
- **wouter**: Lightweight routing library for React
- No database migrations visible (would be needed when transitioning from in-memory to persistent storage)