import React from 'react';
import { cn } from '@/lib/utils';

interface ParchmentFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ragged' | 'ancient' | 'decorated' | 'tattered' | 'wavy';
}

export function ParchmentFrame({
  children,
  className,
  variant = 'default',
  ...props
}: ParchmentFrameProps) {
  // Base styles for all variants
  const baseStyles = "relative transition-all duration-300 isolate";

  // Variant specific styles
  const variants = {
    default: "bg-[#fdfbf7] border border-[#e6e2d3] rounded-sm shadow-sm p-6 overflow-hidden",
    ragged: `
      bg-[#fffef0] 
      p-8
      shadow-lg
      [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] 
      before:content-[''] before:absolute before:inset-0 before:bg-white/20 before:pointer-events-none
      border-2 border-transparent
      overflow-hidden
    `,
    ancient: "bg-[#e8dec0] border border-[#d6cba0] rounded shadow-md p-6 sepia-[0.3] brightness-95 overflow-hidden",
    decorated: "bg-[#fbf8f1] border-4 border-double border-[#bba588] p-6 rounded-lg shadow-xl overflow-hidden",
    
    // NEW VARIANTS using SVG filters
    tattered: `
      bg-[#e3d5b0] 
      text-[#3d3226]
      p-8 
      shadow-[5px_5px_15px_rgba(0,0,0,0.3)]
    `,
    wavy: `
      bg-[#f5eeda]
      p-8
      shadow-md
    `,
  };

  // Additional decorative elements based on variant
  const renderDecorations = () => {
    switch (variant) {
      case 'ragged':
        return (
           <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
        );
      case 'ancient':
        return (
          <>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/10 via-transparent to-black/5" />
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[noise]" /> 
          </>
        );
      case 'decorated':
        return (
            <>
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#bba588]" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#bba588]" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#bba588]" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#bba588]" />
            </>
        );
      case 'tattered':
        return (
          <>
            {/* Inner shadow/burn effect */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(139,69,19,0.2)]" />
            {/* Noise texture opacity */}
             <div 
               className="absolute inset-0 pointer-events-none opacity-[0.08]" 
               style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
               }} 
             />
          </>
        );
      case 'wavy':
        return null;
      default:
        return null;
    }
  };

  // Inline styles for filter application
  // We use specific IDs for filters to reference them
  const filterStyle = variant === 'tattered' ? { filter: 'url(#paper-edge-rough)' } :
                      variant === 'wavy' ? { filter: 'url(#paper-edge-wavy)' } : {};

  return (
    <div className="relative group">
       {/* SVG Filters Definition - Rendered once per component but IDs must be unique if used multiple times 
           with different params. For this demo, static IDs are fine or we could ID them. 
           We use 'hidden' height but keep it in DOM for reference. 
       */}
       <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="paper-edge-rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
          </filter>
          <filter id="paper-edge-wavy" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
          </filter>
        </defs>
      </svg>

      <div
        className={cn(baseStyles, variants[variant], className)}
        {...props}
        style={{ ...filterStyle, ...props.style }}
      >
          {renderDecorations()}
          <div className="relative z-10">
              {children}
          </div>
      </div>
    </div>
  );
}
