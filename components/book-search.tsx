"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { ParchmentFrame } from "@/components/ui/parchment-frame"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { BookResults } from "@/components/book-results"
import { useToast } from "@/hooks/use-toast"
import type { Book, Sighting } from "@/lib/types"

const formSchema = z.object({
  code: z.string().length(9, "Code must be exactly 9 characters"),
})

interface BookSearchProps {
  className?: string
  hideTitle?: boolean
}

export function BookSearch({ className, hideTitle = false }: BookSearchProps) {
  const [bookData, setBookData] = useState<{ book: Book; sightings: Sighting[] } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/books/${values.code}`)
      if (!response.ok) {
        throw new Error("Book not found")
      }
      const data = await response.json()
      setBookData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch book data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!hideTitle && (
        <div className="mb-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#4a3b2a]">Search Book by Code</h2>
        </div>
      )}
      <div className="p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter book code"
                        {...field}
                        className="lowercase bg-white/90 border-[#8b4513]/30 shadow-sm focus-visible:ring-[#8b4513] text-base md:text-lg"
                      />
                      <Button type="submit" disabled={isLoading}>
                        Add sighting
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {bookData && <BookResults book={bookData.book} sightings={bookData.sightings} />}
    </div>
  )
}
