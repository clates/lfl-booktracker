import React from 'react';
import { cn } from '@/lib/utils';

interface ParchmentFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ragged' | 'ancient' | 'decorated';
}

export function ParchmentFrame({
  children,
  className,
  variant = 'default',
  ...props
}: ParchmentFrameProps) {
  // Base styles for all variants
  const baseStyles = "relative overflow-hidden transition-all duration-300";

  // Variant specific styles
  const variants = {
    default: "bg-[#fdfbf7] border border-[#e6e2d3] rounded-sm shadow-sm p-6",
    ragged: `
      bg-[#fffef0] 
      p-8
      shadow-lg
      [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] 
      before:content-[''] before:absolute before:inset-0 before:bg-white/20 before:pointer-events-none
      border-2 border-transparent
    `, // We might need more complex CSS for true "ragged", but let's start with a rough look using custom shadows or borders. 
       // Actually, let's use a wavy border via CSS mask or just a distinctive border style.
       // For now, let's use a generic "rough" paper look with irregular border radius.
    
    ancient: "bg-[#e8dec0] border border-[#d6cba0] rounded shadow-md p-6 sepia-[0.3] brightness-95",
    decorated: "bg-[#fbf8f1] border-4 border-double border-[#bba588] p-6 rounded-lg shadow-xl",
  };

  // Additional decorative elements based on variant
  const renderDecorations = () => {
    switch (variant) {
      case 'ragged':
        // A simple jagged edge effect could be added here if we had the SVG assets, 
        // but for a pure CSS solution without external assets, we might rely on the main container styling.
        // Let's add a texture overlay.
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
                {/* Corner flourishes */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#bba588]" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#bba588]" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#bba588]" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#bba588]" />
            </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
      style={variant === 'ragged' ? {
        // A simple jagged edge using conic-gradient for the mask
        // This is a bit advanced/experimental for pure tailwind, so mostly sticking to visual fallbacks.
        // Let's just give it a 'wobbly' border radius for now.
        borderRadius: '2px 255px 3px 25px / 255px 5px 225px 3px',
        border: '1px solid #e3dec3'
      } : {}}
    >
        {renderDecorations()}
        <div className="relative z-10">
            {children}
        </div>
    </div>
  );
}
