import React from "react"

export function ParchmentFilters() {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
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
  )
}
