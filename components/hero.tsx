import { BookSearch } from "@/components/book-search"

export function Hero() {
  return (
    <section className="w-full py-6 md:py-12 lg:py-16 xl:py-20 bg-gradient-to-b from-primary/10 via-background to-transparent">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2 mb-8">
            <h1 className="font-serif text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-primary">
              Add to this book's story
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-serif italic text-lg">
              Log your location to update the history, and see where this book has been.
            </p>
          </div>
          <div className="w-full max-w-sm md:max-w-2xl space-y-2">
            <BookSearch hideTitle className="border-0 shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}
