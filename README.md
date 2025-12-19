# TaleTrail

BookTracker is a Next.js application designed to track books as they travel between readers, specifically tailored for Little Free Libraries (LFL). Think of it as "Where's George" but for little libraries. It allows users to register books, generate unique tracking codes, and view a book's journey through "sightings".

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn/UI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password, OAuth providers: Google, GitHub, Twitter, Instagram) - _Configured for local development_
- **Mapping:** Leaflet/React-Leaflet
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn or pnpm
- Supabase account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/lfl-booktracker.git
    cd lfl-booktracker
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    cp .env.example .env.local
    Update `.env.local` with your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

    Based on recent verification, `DB_KEY` is also used for code generation API:

    ```env
    DB_KEY=your-service-role-key # Keep this secret!
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Testing

Run the test suite with:

```bash
yarn test
```

Specific test instructions:

- `yarn test __tests__/geohash.test.ts` for Geohash logic.
- `yarn test __tests__/openLibrary.test.ts` for Book cover API.
- `yarn test __tests__/book-api.test.ts` for Book API endpoints.

## Authentication (Local Setup)

Authentication uses Supabase. To test sign-in flow locally:

1. Ensure your `.env.local` has valid Supabase keys.
2. Sign up a user through the `/login` page (or Supabase dashboard).
3. Confirm email (if enabled) or disable email confirmation in Supabase.
4. Sign in to access protected routes like `/generate`.

## Features (Current)

- **Book Registration:** Generate a unique 9-character code for your book.
- **Code Generation:** Securely generates unique codes using backend logic.
- **Book Search:** Look up a book's history by its code.
- **Sightings:** Record where you found a book (Location support pending).
- **Cover Search:** Find book covers via Google Books API integration.

## License

MIT
