import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { claimSightings } from '@/lib/claimSightings';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookTracker',
  description: 'Track and generate book codes',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.DB_KEY
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  const cookieStore = cookies();
  const anonymousId = cookieStore.get('lfl_anonymous_id')?.value;

  if (session?.user?.id && anonymousId) {
    // Fire and forget? ideally await to ensure consistency but don't block too long?
    // We await to ensure it happens.
    await claimSightings(session.user.id, anonymousId);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}