import React from "react"
import { cn } from "@/lib/utils"

interface ParchmentFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ragged" | "ancient" | "decorated" | "tattered" | "wavy"
}

export function ParchmentFrame({
  children,
  className,
  variant = "default",
  ...props
}: ParchmentFrameProps) {
  // Base structural styles (padding, positioning) - applied to the container
  const containerStyles = "relative transition-all duration-300 isolate"

  // Content styles (text color, etc)
  const contentStyles = {
    default: "text-stone-900 p-6",
    ragged: "text-stone-900 p-8",
    ancient: "p-6", // text color handled by inner elements or inheritance? ancient had specific look
    decorated: "text-stone-800 p-6",
    tattered: "text-[#3d3226] p-8",
    wavy: "text-stone-900 p-8",
  }

  // Surface styles (background, border, shadow, filter) applied to a separate background layer.
  // Filtered variants use this layer so visual filters do not affect the foreground text content.
  const surfaceClasses = {
    default: "bg-[#fdfbf7] border border-[#e6e2d3] rounded-sm shadow-sm",
    ragged: `
      bg-[#fffef0] 
      shadow-lg
      [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] 
      border-2 border-transparent
    `,
    ancient: "bg-[#e8dec0] border border-[#d6cba0] rounded shadow-md sepia-[0.3] brightness-95",
    decorated: "bg-[#fbf8f1] border-4 border-double border-[#bba588] rounded-lg shadow-xl",
    tattered: "bg-[#e3d5b0] shadow-[5px_5px_15px_rgba(0,0,0,0.3)]",
    wavy: "bg-[#f5eeda] shadow-md",
  }

  const isFiltered = variant === "tattered" || variant === "wavy"

  // Additional decorations (overlay textures etc)
  const renderDecorations = () => {
    switch (variant) {
      case "ragged":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
        )
      case "ancient":
        return (
          <>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/10 via-transparent to-black/5" />
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[noise]" />
          </>
        )
      case "decorated":
        return (
          <>
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#bba588]" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#bba588]" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#bba588]" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#bba588]" />
          </>
        )
      case "tattered":
        return (
          <>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(139,69,19,0.2)]" />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </>
        )
      default:
        return null
    }
  }

  // Filter styles
  const filterStyle =
    variant === "tattered"
      ? { filter: "url(#paper-edge-rough)" }
      : variant === "wavy"
        ? { filter: "url(#paper-edge-wavy)" }
        : {}

  return (
    <div className="relative group">
      <div
        className={cn(containerStyles, contentStyles[variant], className)}
        {...props}
        style={{ ...props.style }}
      >
        {/* Background Layer: Handles color, shadow, borders, and FILTERS */}
        <div
          className={cn("absolute inset-0 -z-10", surfaceClasses[variant])}
          style={isFiltered ? filterStyle : undefined}
        >
          {/* Render decorations inside the filtered background so borders/edges match the parchment surface and filters. */}
          {renderDecorations()}
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}
