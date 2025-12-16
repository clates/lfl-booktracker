
import { BookSearch } from '@/components/book-search';

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Where does your book journey begin?
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Track your book's travels, discover its story, and share the joy of reading.
            </p>
          </div>
          <div className="w-full max-w-sm md:max-w-2xl space-y-2">
            <BookSearch hideTitle className="border-0 shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
