# Travel App

A travel app built with Next.js, React, and Tailwind CSS.

## Features

- Search for destinations
- Browse curated destinations lists (Tripadvisor Traveler's Choice Awards, and more to come)
- Pin and unpin favorite places

## Getting Started

1. **Install dependencies:**

   ```
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env` file and add your Google Places API key:

   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

3. **Run the development server:**

   ```
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

- Unit tests are written with Jest and React Testing Library.
- To run tests:

  ```
  npm test
  ```

## Project Structure

- `src/app/` — Next.js pages and layouts
- `src/components/` — React components
- `src/contexts/` — React context for global state
- `src/lib/` — Utility functions and API actions
