# BookTracker

BookTracker is a Next.js application designed to track books as they travel between readers, specifically tailored for Little Free Libraries (LFL). Think of it as "Where's George" but for little libraries. It allows users to register books, generate unique tracking codes, and view a book's journey through "sightings".

## Features

- **Generate Unique Book Codes**: Register a new book by searching the Open Library database. The app automatically fetches metadata (Title, Author, Cover) and generates a unique 9-character code (e.g., `ABC-DEF-GHI`).
- **Track Books**: Users can enter a book's code to view its details and travel history.
- **Location Awareness**: Captures geolocation data when registering books to map their journey.
- **Open Library Integration**: Seamlessly searches and retrieves book information from [Open Library](https://openlibrary.org/).
- **Responsive Design**: Built with a mobile-first approach using Tailwind CSS and Radix UI primitives.

## Technlogy Stack

- **Framework**: [Next.js 13](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd lfl-booktracker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Environment Variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials. You likely need:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Registering a Book

1. Navigate to the **Generate Code** page.
2. Search for a book by Title or ISBN.
3. Select the correct book from the results.
4. The app will generate a unique tracking code. Write this code in the book!

### Tracking a Book

1. Navigate to the **Home** (Search) page.
2. Enter the 9-character code found in the book.
3. View the book's details and its history of sightings.

## License

[MIT](LICENSE)

## Testing

This project uses [Jest](https://jestjs.io/) for unit testing.

To run the test suite:

```bash
npm run test
# or
yarn test
```

Tests are located in the `__tests__` directory and mirror the project structure.
