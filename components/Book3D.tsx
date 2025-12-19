"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface Book3DProps {
  coverUrl: string
  isOpen: boolean
  className?: string
  aspectRatio?: number // width / height, default 2/3 (0.66)
}

export const Book3D = ({ coverUrl, isOpen, className, aspectRatio = 2 / 3 }: Book3DProps) => {
  return (
    <div
      className={cn("relative z-10 group w-full h-full", className)}
      style={{
        perspective: "1500px",
      }}
    >
      {/* Book Container - scales based on width provided by parent, height derived from aspect ratio if needed, 
          but usually we want to fit within a container. 
          Let's assume the parent sets the width/height controls or we provide reasonable defaults.
      */}
      <div
        className={cn(
          "relative w-full h-full transition-all duration-[600ms] ease-in-out [transform-style:preserve-3d]",
          // When open, we might want to shift the whole book slightly to center it visually if needed,
          // but for now let's keep it simple.
          isOpen && "translate-x-[20%]"
        )}
      >
        {/* FRONT COVER */}
        <div
          className={cn(
            "absolute inset-0 z-20 transition-all duration-[600ms] ease-in-out origin-left [transform-style:preserve-3d]",
            isOpen ? "[transform:rotateY(-160deg)]" : "[transform:rotateY(0deg)]"
          )}
        >
          {/* Front Face (Cover Image) */}
          <div
            className="absolute inset-0 z-20 [backface-visibility:hidden] rounded-r-sm shadow-xl overflow-hidden bg-slate-200"
            style={{
              backgroundImage: `url("${encodeURI(coverUrl)}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Spine Highlight/Crease on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent" />
            {/* Gloss shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Inside Front Cover (Left Page when open) */}
          <div className="absolute inset-0 z-10 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#fdfbf7] rounded-l-sm overflow-hidden border-r border-gray-200">
            {/* Paper texture / Page content simulation */}
            <div className="absolute inset-2 border border-black/5 opacity-50" />
            <div className="absolute bottom-4 left-4 text-[10px] text-gray-400 font-serif">
              Ex Libris
            </div>
            {/* Shadow overlay for depth when opening */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* BACK COVER / INSIDE BACK (Right Page) */}
        <div className="absolute inset-0 z-0 bg-[#fdfbf7] rounded-r-sm shadow-lg border-l border-gray-200">
          {/* Fake pages thickness effect on the right edge */}
          <div className="absolute top-[2px] bottom-[2px] right-0 w-[3px] bg-gradient-to-l from-gray-200 to-white" />

          {/* Page Content simulation */}
          <div className="absolute inset-4 flex flex-col gap-2 opacity-10">
            <div className="h-2 w-3/4 bg-black rounded" />
            <div className="h-2 w-full bg-black rounded" />
            <div className="h-2 w-5/6 bg-black rounded" />
            <div className="h-2 w-full bg-black rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
