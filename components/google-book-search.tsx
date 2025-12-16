"use client"

import * as React from "react"
import { Search, Book as BookIcon, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    imageLinks?: {
      thumbnail: string
    }
  }
}

interface GoogleBookSearchProps {
  onSelect?: (book: { title: string; coverUrl?: string }) => void
}

export function GoogleBookSearch({ onSelect }: GoogleBookSearchProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<GoogleBook[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    const fetchBooks = async () => {
      if (!debouncedQuery) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          // No API key used intentionally.
          // Unauthenticated requests are rate-limited per user IP, distributing the quota cost
          // to the end user rather than a centralized project quota.
          `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(debouncedQuery)}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }
        const data = await response.json()
        setResults(data.items || [])
      } catch (err) {
        setError("Failed to search books. Please try again.")
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [debouncedQuery])

  const handleSelect = (book: GoogleBook) => {
      const payload = {
          title: book.volumeInfo.title,
          coverUrl: book.volumeInfo.imageLinks?.thumbnail
      }
      
      // Dismiss keyboard on mobile (if applicable/browser supports it via blur)
      if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
      }

      onSelect?.(payload)
      console.log("Selected book:", payload)
  }

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a book by title..."
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && (
             <div className="absolute right-2 top-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
             </div>
        )}
      </div>

      <div className="space-y-2 min-h-[200px]">
        <h3 className="text-sm font-medium text-muted-foreground">
            {results.length > 0 ? "Suggestions" : ""}
        </h3>
        
        {error && (
            <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
            </div>
        )}

        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted">
            {results.length === 0 && !loading && debouncedQuery && !error && (
                 <div className="flex items-center justify-center w-full p-8 text-sm text-muted-foreground border border-dashed rounded-lg h-48">
                    No books found. Try a different title.
                 </div>
            )}
            
            {results.length === 0 && !debouncedQuery && (
                 <div className="flex items-center justify-center w-full p-8 text-sm text-muted-foreground border border-dashed rounded-lg h-48">
                    Start typing to see book covers...
                 </div>
            )}

            {results.map((book) => (
                <button
                    key={book.id}
                    onClick={() => handleSelect(book)}
                    className="flex-none w-[120px] snap-start group text-left focus:outline-none focus:ring-2 focus:ring-ring rounded-md p-1 hover:bg-muted/50 transition-colors"
                >
                    <div className="aspect-[2/3] relative rounded-md overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-shadow">
                        {book.volumeInfo.imageLinks?.thumbnail ? (
                            <img 
                                src={book.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')} 
                                alt={book.volumeInfo.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <BookIcon className="h-8 w-8 opacity-20" />
                            </div>
                        )}
                    </div>
                    <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium leading-tight line-clamp-2" title={book.volumeInfo.title}>
                            {book.volumeInfo.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">
                            {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                        </p>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  )
}
