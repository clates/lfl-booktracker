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
import { useState } from "react";
import { GenerateBookCodeRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  location: z.string().min(2, "Location must be at least 2 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  lat: z.string().min(2, "Title must be at least 2 characters"),
  long: z.string().min(2, "Title must be at least 2 characters"),
});

export default function GeneratePage() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      author: "",
      title: "",
      lat: "",
      long: "",
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
          location: { lat: values.lat, long: values.long },
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lat</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="long"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter long" {...field} />
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
