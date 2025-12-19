import React from "react"
import { ParchmentFrame } from "@/components/ui/parchment-frame"
import { ScrollText, Map, BookOpen, Feather } from "lucide-react"

export default function ParchmentShowcasePage() {
  return (
    <div className="min-h-screen bg-stone-100 p-8 space-y-12">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-stone-800">Parchment Styles Showcase</h1>
        <p className="text-stone-600">
          A collection of paper and parchment styles for the BookTracker interface.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* VARIANT 1: DEFAULT */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-700">1. Default Variant</h2>
          <ParchmentFrame variant="default">
            <div className="flex flex-col items-center text-center space-y-4">
              <BookOpen className="w-12 h-12 text-amber-800 opacity-80" />
              <h3 className="text-2xl font-serif font-bold text-amber-900">Standard Page</h3>
              <p className="text-stone-700 leading-relaxed font-serif">
                "A clean, simple parchment style suitable for standard content containers, cards,
                and reading areas. It features a subtle texture and warm off-white color."
              </p>
              <button className="px-4 py-2 bg-amber-800 text-amber-50 rounded hover:bg-amber-900 transition-colors">
                Read More
              </button>
            </div>
          </ParchmentFrame>
        </div>

        {/* VARIANT 2: RAGGED */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-700">2. Ragged Variant</h2>
          <ParchmentFrame variant="ragged">
            <div className="flex flex-col items-center text-center space-y-4">
              <Feather className="w-12 h-12 text-stone-600 opacity-80" />
              <h3 className="text-2xl font-serif font-bold text-stone-800 italic">Rough Notes</h3>
              <p className="text-stone-700 leading-relaxed font-serif font-medium">
                "Intended for loose notes, field scraps, or less formal content. The edges are
                irregular, suggesting a hand-torn piece of paper found in a pocket."
              </p>
              <div className="w-full h-px bg-stone-300 my-2" />
              <p className="text-sm text-stone-500 font-handwriting">
                - Found in the archives, 1923
              </p>
            </div>
          </ParchmentFrame>
        </div>

        {/* VARIANT 3: ANCIENT */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-700">3. Ancient Variant</h2>
          <ParchmentFrame variant="ancient">
            <div className="flex flex-col items-center text-center space-y-4">
              <ScrollText className="w-12 h-12 text-amber-900 opacity-90" />
              <h3 className="text-2xl font-serif font-bold text-amber-950 uppercase tracking-widest">
                Ancient Scroll
              </h3>
              <p className="text-amber-900/80 leading-relaxed font-serif text-lg">
                "For historical records, legends, or significant milestones. This style is darker,
                heavily textured, and feels aged by centuries."
              </p>
            </div>
          </ParchmentFrame>
        </div>

        {/* VARIANT 4: DECORATED */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-700">4. Decorated Variant</h2>
          <ParchmentFrame variant="decorated">
            <div className="flex flex-col items-center text-center space-y-4">
              <Map className="w-12 h-12 text-[#bba588]" />
              <h3 className="text-2xl font-serif font-bold text-[#8a765a] border-b-2 border-[#bba588] pb-1">
                Royal Decree
              </h3>
              <p className="text-[#6d5d48] leading-relaxed font-serif">
                "A formal, high-status container with double borders and corner flourishes. Use this
                for achievements, official announcements, or primary feature highlights."
              </p>
            </div>
          </ParchmentFrame>
        </div>

        {/* VARIANT 5: TATTERED (NEW) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-700">5. Tattered (SVG Filter)</h2>
          <ParchmentFrame variant="tattered" className="bg-[#e6dcc3]">
            <div className="flex flex-col items-center text-center space-y-4">
              <Feather className="w-12 h-12 text-stone-800 opacity-80" />
              <h3 className="text-2xl font-serif font-bold text-stone-900 border-b border-stone-800/20 pb-2">
                Ancient Manuscript
              </h3>
              <p className="text-stone-800 leading-relaxed font-serif font-medium">
                "This variant uses SVG filters to distort the DOM element's edges, creating a true
                organic, torn-paper feel. It includes a noisy paper texture and inner vignetting."
              </p>
            </div>
          </ParchmentFrame>
        </div>

        {/* VARIANT 6: WAVY (NEW) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-700">6. Wavy (SVG Filter)</h2>
          <ParchmentFrame variant="wavy">
            <div className="flex flex-col items-center text-center space-y-4">
              <BookOpen className="w-12 h-12 text-amber-900 opacity-80" />
              <h3 className="text-2xl font-serif font-bold text-amber-900">Handmade Paper</h3>
              <p className="text-stone-700 leading-relaxed font-serif">
                "A softer, more subtle distortion that mimics the deckled edges of handmade paper.
                Uses a lower frequency turbulence filter."
              </p>
            </div>
          </ParchmentFrame>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <ParchmentFrame variant="default" className="text-center p-8">
          <h2 className="text-xl font-sans font-bold mb-4">Responsiveness Check</h2>
          <p>Resize the window window to see how these adapt to smaller screens.</p>
        </ParchmentFrame>
      </div>
    </div>
  )
}
