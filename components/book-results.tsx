'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Book, Sighting } from '@/lib/types';

interface BookResultsProps {
  book: Book;
  sightings: Sighting[];
}

export function BookResults({ book, sightings: initialSightings }: BookResultsProps) {
  const [sightings, setSightings] = useState(initialSightings);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function recordHit() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sightings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          location: 'Current Location', // In a real app, this would be dynamic
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record hit');
      }

      const newHit = await response.json();
      setSightings([newHit, ...sightings]);
      toast({
        title: 'Success',
        description: 'Hit recorded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record hit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{book.title}</CardTitle>
        <Button onClick={recordHit} disabled={isLoading}>
          Record Hit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Author</p>
            <p>{book.author}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p>{book.location}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Sightings</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sightings.map((hit) => (
                <TableRow key={hit.id}>
                  <TableCell>{hit.user?.email || 'Anonymous'}</TableCell>
                  <TableCell>{hit.location}</TableCell>
                  <TableCell>
                    {format(new Date(hit.created_at), 'PPp')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}