"use client";

import React, { useState } from "react";
import { Book3D } from "@/components/Book3D";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function BookDemoPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState(
    "https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
  );
  const [width, setWidth] = useState(200);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-8 gap-12">
        <div className="max-w-md text-center space-y-2">
            <h1 className="text-3xl font-bold text-neutral-900">3D Book Component Demo</h1>
            <p className="text-neutral-500">Manual verification for opening/closing interactions.</p>
        </div>

      {/* Stage */}
      <div className="relative flex items-center justify-center perspective-[2000px] py-20">
        <div 
            style={{ width: `${width}px`, aspectRatio: '2/3' }}
            className="transition-all duration-300"
        >
            <Book3D coverUrl={coverUrl} isOpen={isOpen} />
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-6 border border-neutral-200">
        
        <div className="flex items-center justify-between">
            <Label htmlFor="book-state" className="text-base font-medium">Book Open</Label>
            <Switch 
                id="book-state" 
                checked={isOpen} 
                onCheckedChange={setIsOpen} 
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="cover-url">Cover Image URL</Label>
            <Input 
                id="cover-url" 
                value={coverUrl} 
                onChange={(e) => setCoverUrl(e.target.value)} 
                className="font-mono text-xs"
            />
        </div>

        <div className="space-y-2">
            <div className="flex justify-between">
                <Label>Book Width (px)</Label>
                <span className="text-xs text-neutral-500 font-mono">{width}px</span>
            </div>
            <Slider 
                value={[width]} 
                min={100} 
                max={400} 
                step={10} 
                onValueChange={(val) => setWidth(val[0])} 
            />
        </div>

      </div>
    </div>
  );
}
