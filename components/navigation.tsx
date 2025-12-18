'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle, LogIn, LogOut } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useMemo } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { ParchmentFrame } from '@/components/ui/parchment-frame';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = useMemo(() => createClientComponentClient(), []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    toast.success('Signed out successfully');
  };

  return (
    <header className="relative z-50">
      <ParchmentFrame variant="wavy" className="rounded-none border-b-0 p-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="text-muted-foreground h-6 w-6" />
            <span className="text-muted-foreground font-bold text-xl">BookTracker</span>
          </Link>
          <nav className="flex items-center space-x-4">
            {user && (
              <Button
                variant={pathname === '/generate' ? 'default' : 'ghost'}
                asChild
              >
                <Link href="/generate">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Generate Code
                </Link>
              </Button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  {user.email}
                </span>
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant={pathname === '/login' ? 'default' : 'ghost'}
                asChild
              >
                <Link href="/login" className="text-muted-foreground">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </ParchmentFrame>
    </header>
  );
}
