# ExchangeHub - Currency & Crypto Exchange Platform

## Overview

ExchangeHub is a modern web application that provides real-time data for forex and cryptocurrency markets, along with currency conversion capabilities. The application follows a client-server architecture with a React frontend and an Express backend. The system uses Drizzle ORM for database operations and is designed to be deployed on Replit's platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and uses the following key technologies:

- **React**: For building the UI components
- **React Query (TanStack Query)**: For data fetching and state management
- **Wouter**: For client-side routing
- **Radix UI**: For accessible UI components
- **Tailwind CSS**: For styling
- **shadcn/ui**: Component library built on top of Radix UI and Tailwind
- **Vite**: As the build tool and development server

The application follows a component-based architecture where UI elements are broken down into reusable components. The UI adopts a design system with consistent styling across the application.

### Backend Architecture

The backend is built with Express.js and provides the following functionality:

- **REST API**: For serving data to the frontend
- **Proxy to External APIs**: For fetching forex and crypto data
- **Database Operations**: Using Drizzle ORM for data persistence

The server handles routing for both API endpoints and serves the frontend static files in production.

### Data Storage

The application uses a PostgreSQL database with Drizzle ORM for database operations. The schema defines tables for:

- Currencies (forex and crypto)
- Exchanges
- Conversion History

### API Structure

The backend provides several API endpoints:

- `/api/forex`: For fetching forex currency data
- `/api/crypto`: For fetching cryptocurrency data
- `/api/currencies`: For fetching all currencies (possibly filtered by type)
- `/api/convert`: For currency conversion
- `/api/exchanges`: For cryptocurrency exchange data

## Key Components

### Frontend Components

1. **Page Components**: Dashboard, Forex, Crypto, Exchanges, Converter, AllCurrencies
2. **UI Components**: A comprehensive set of UI components from shadcn/ui (tables, cards, buttons, etc.)
3. **Common Components**: 
   - MarketTable: For displaying forex and crypto currency data
   - CurrencyConverter: For converting between currencies
   - CurrencyChart: For displaying price charts
   - ExchangeCard: For displaying exchange information

### Backend Components

1. **Express Server**: The main server that handles routing and middleware
2. **API Routes**: Define the endpoints for data access
3. **Storage Module**: Abstracts database operations
4. **Vite Integration**: For serving the frontend in development

## Data Flow

1. **User Interactions**: 
   - Users browse currency data on various pages
   - Users can convert between currencies
   - Users can view detailed information about exchanges

2. **Data Fetching**:
   - React components use React Query hooks to fetch data from the backend
   - Backend fetches data from external APIs and/or the database
   - Data is cached on the client for better performance

3. **State Management**:
   - React Query manages server state
   - React's useState and context API manage UI state

## External Dependencies

### External APIs
The application relies on several external APIs:
- Exchange Rate API for forex data
- CoinGecko API for cryptocurrency data

### NPM Packages
Key dependencies include:
- React and React DOM
- TanStack React Query
- Drizzle ORM
- Express
- Radix UI components
- shadcn/ui components
- Tailwind CSS
- Vite

## Deployment Strategy

The application is configured to be deployed on Replit with:

1. **Development Mode**:
   - `npm run dev` command runs both frontend and backend servers
   - Vite provides hot module replacement for frontend development

2. **Production Build**:
   - Frontend is built with Vite (`vite build`)
   - Backend is bundled with esbuild
   - Output is combined in the `dist` directory

3. **Production Start**:
   - `npm run start` command starts the production server
   - Express serves the static frontend files
   - The server handles API requests

## Database Setup

The application uses Drizzle ORM with PostgreSQL. The database schema includes:

- `currencies`: Stores forex and crypto currency data
- `exchanges`: Stores cryptocurrency exchange information
- `conversionHistory`: Tracks user currency conversions

The Drizzle configuration expects a `DATABASE_URL` environment variable to be set.

## Next Steps for Implementation

1. Complete the backend API routes for all endpoints
2. Implement database operations using Drizzle ORM
3. Add authentication and user accounts if required
4. Implement caching strategies for external API calls
5. Add error handling and logging
6. Complete the frontend components and pages