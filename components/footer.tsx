
import Link from 'next/link';
import { ParchmentFrame } from '@/components/ui/parchment-frame';

export function Footer() {
  return (
    <footer className="w-full bg-transparent py-6">
      <ParchmentFrame variant="wavy" className="border-t-0 rounded-none">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row mx-auto px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} TaleTrail. Built with ♥ for book lovers.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm font-medium underline underline-offset-4 hover:text-primary">
              Privacy Policy (Ultra Informal: We don't want your data!)
            </Link>
          </div>
        </div>
      </ParchmentFrame>
    </footer>
  );
}
