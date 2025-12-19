import { GoogleBookSearch } from "@/components/google-book-search"

export default function GoogleBooksShowcasePage() {
  return (
    <div className="container py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Google Books API Showcase</h1>
        <p className="text-muted-foreground">
          Demonstrating the type-ahead search component with horizontal shelf layout.
        </p>
      </div>

      <div className="p-6 border rounded-xl bg-card">
        <GoogleBookSearch />
      </div>
    </div>
  )
}
