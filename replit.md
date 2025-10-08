# WhatsApp Analytics Dashboard

## Overview

This is a WhatsApp Analytics Dashboard that allows users to upload their exported WhatsApp chat files (.txt) and receive detailed analytics about their messaging patterns, activity timelines, emotional sentiment, media usage, and behavioral insights. The application parses chat exports, performs analysis on messaging data, and presents visualizations through an interactive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component Library**: Shadcn UI components built on Radix UI primitives, providing accessible and customizable components following Material Design principles with modern dashboard aesthetics

**Styling**: Tailwind CSS with custom theme configuration supporting light/dark modes. The design system uses WhatsApp green as the primary color (142 85% 25% in light mode, 142 75% 45% in dark mode) with carefully chosen chart colors for data visualization

**Routing**: Wouter for client-side routing with pages organized by analytics categories:
- Overview (main dashboard)
- Messages (messaging patterns)
- Activity (timeline analytics)
- Media & Status (content engagement)
- Behavior (usage patterns)
- Emotional (sentiment analysis)
- Calls (calling habits)
- System (technical stats)
- AI Insights (smart summaries)

**State Management**: React Query (@tanstack/react-query) for server state management with localStorage for persisting analytics data between sessions

**Design Approach**: Data-first design prioritizing clarity and actionable insights, with animated charts, heatmaps, and statistical visualizations

### Backend Architecture

**Runtime**: Node.js with Express.js server

**Language**: TypeScript with ESM modules

**File Upload**: Multer middleware for handling WhatsApp chat export file uploads (50MB limit, text files only)

**Parser**: Custom WhatsAppParser class that processes chat export text files using regex patterns to extract:
- Message timestamps
- Sender identification
- Message content and type (text, media, voice, video, call, system)
- Media attachments
- Deleted messages

**Analytics Engine**: AnalyticsEngine class that processes parsed messages to generate:
- User detection (identifies current user from message patterns)
- Contact statistics with sentiment analysis
- Activity heatmaps (hourly activity across days)
- Media usage statistics
- Call statistics
- Sentiment analysis with emoji extraction
- Response time calculations
- Digital wellbeing scores

**Storage**: Currently using in-memory storage (MemStorage class) with interfaces designed for future database integration. The storage layer supports:
- User management
- Analytics data persistence
- Session management ready (connect-pg-simple configured)

### Data Storage Solutions

**Current Implementation**: In-memory storage using Map data structures for rapid prototyping

**Database Schema**: Drizzle ORM configured for PostgreSQL with schema defined for:
- Users table with id, username, password fields
- Prepared for Neon serverless PostgreSQL integration (@neondatabase/serverless)

**Schema Organization**: Shared TypeScript types and Zod schemas for validation across client and server:
- ParsedMessage interface for chat data
- AnalyticsData interface for computed metrics
- ContactStats, ActivityData, MediaStats, SentimentData, CallStats interfaces

### Authentication and Authorization

**Current State**: Basic user schema defined but authentication not yet implemented

**Prepared Infrastructure**:
- Session store configuration (connect-pg-simple) for PostgreSQL-backed sessions
- User schema with username/password fields
- InsertUser schema with Zod validation

**Security Considerations**: File uploads limited to text files only with size restrictions

### External Dependencies

**UI Framework Dependencies**:
- Radix UI component primitives for accessibility
- Recharts for data visualization (chart components)
- Class Variance Authority (CVA) for component variant management
- date-fns for date formatting and manipulation

**Build and Development Tools**:
- Vite for fast frontend development and building
- Replit-specific plugins for development environment integration
- esbuild for backend bundling in production

**Database and ORM**:
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL driver
- Drizzle Kit for migrations management

**Form Handling**:
- React Hook Form with Zod resolvers for validated form inputs

**Styling Utilities**:
- Tailwind CSS for utility-first styling
- clsx and tailwind-merge for conditional class composition

**Type Safety**:
- TypeScript throughout the stack
- Zod for runtime validation and schema generation
- Shared types between frontend and backend

**File Format Support**: Currently supports standard WhatsApp chat export format with patterns for various date/time formats and message types including system messages, media attachments, and calls
