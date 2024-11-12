"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { GenerateBookCodeRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import useLocation from "@/hooks/use-location";
import { OpenLibraryDoc } from "@/lib/openLibrary";
import AutoCompleteResults from "@/components/autoCompleteResults";

const formSchema = z.object({
  location: z.string().min(2, "Location must be at least 2 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  lat: z.string().min(2, "Title must be at least 2 characters"),
  long: z.string().min(2, "Title must be at least 2 characters"),
  isbn: z.string().min(2, "ISBN must be at least 8 characters"),
});

export default function GeneratePage() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { latitude, longitude, error } = useLocation();
  const [titleInput, setTitleInput] = useState<string>("");
  const [isbnInput, setIsbnInput] = useState<string>("");
  const [titleResults, setTitleResults] = useState<any[]>([]);

  /**
   * AutoComplete when typing in the title field.
   * This will fetch results from the OpenLibrary API and display them in a list.
   */
  useEffect(() => {
    const fetchResults = async () => {
      let searchCriteria = "";
      if (titleInput.length >= 6) {
        searchCriteria = `title=${titleInput}*`;
      } else if (isbnInput.length >= 8) {
        searchCriteria = `isbn=${isbnInput}*`;
      }
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?${searchCriteria}&fields=title,author_name,cover_i,isbn,ratings_count,cover_edition_key&limit=20`
        );
        const data: { docs: OpenLibraryDoc[] } = await response.json();
        setTitleResults(
          data.docs.sort((a, b) => a.ratings_count - b.ratings_count) || []
        );
      } catch (fetchError) {
        console.error("Error fetching data:", fetchError);
      }
    };

    // Debounce the API call by setting a timer
    const debounceTimer = setTimeout(() => {
      if (titleInput.length >= 6 || isbnInput.length >= 8) {
        // Adjust this condition as needed
        fetchResults();
      } else {
        setTitleResults([]);
      }
    }, 300); // Delay in milliseconds

    return () => clearTimeout(debounceTimer); // Cleanup the timer
  }, [titleInput, isbnInput]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      title: "",
      isbn: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/books/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          author: values.author,
          location: {
            lat: latitude ? latitude : 0,
            long: longitude ? longitude : 0,
          },
        } as GenerateBookCodeRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to record hit");
      }

      const { code } = await response.json();
      setGeneratedCode(code);
      toast({
        title: "Success",
        description: "Hit recorded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record hit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Format the code into ###-###-### format
  function formatCode(code: string) {
    return `${code.slice(0, 3)}-${code.slice(3, 6)}-${code.slice(
      6,
      9
    )}`.toUpperCase();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Generate Book Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          placeholder="Enter title"
                          {...field}
                          onChange={(e) => {
                            setTitleInput(e.target.value);
                            field.onChange(e);
                          }}
                        />
                        <AutoCompleteResults
                          results={titleInput ? titleResults : []}
                          onClick={console.log}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          placeholder="Enter ISBN"
                          {...field}
                          onChange={(e) => {
                            setIsbnInput(e.target.value);
                            field.onChange(e);
                          }}
                        />
                        <AutoCompleteResults
                          results={isbnInput ? titleResults : []}
                          onClick={console.log}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Generate Code
              </Button>
            </form>
          </Form>

          {generatedCode && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Generated Code:
              </p>
              <p className="text-3xl font-mono text-center">
                {formatCode(generatedCode)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
