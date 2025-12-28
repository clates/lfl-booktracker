"use client"

import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { ParchmentFrame } from "@/components/ui/parchment-frame"
import { cn } from "@/lib/utils"

interface BookStickerInstructionProps {
  code: string
  coverUrl?: string
  className?: string
  animationSpeedMultiplier?: number
}

// Animation Configuration
const ANIMATION_BASE_DURATION_S = 2.5
// Derived timings
const ANIMATION_CONFIG = {
  duration: ANIMATION_BASE_DURATION_S,
  openDelay: ANIMATION_BASE_DURATION_S * 0.3, // ~0.5s if base is 2.5
  urlWriteDelay: ANIMATION_BASE_DURATION_S * 0.28, // Starts shortly after page flip starts? No, originally 0.2 which is small.
  codeWriteDelay: 1.0, // 1.2 - 0.2, relative to URL finishing
}

const TypewriterText = ({
  text,
  delay = 0,
  className,
}: {
  text: string
  delay?: number
  className?: string
}) => {
  // Split text into characters
  const characters = text.split("")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      } as any, // Cast to any to bypass strict variant typing issues with spring
    },
    hidden: {
      opacity: 0,
      y: 5,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      } as any,
    },
  }

  return (
    <motion.div
      style={{ display: "inline-block" }} // Ensure inline-block for proper spacing
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span variants={child} key={index}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

export function BookStickerInstruction({ code, coverUrl, className }: BookStickerInstructionProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(1 / 1.3)

  // Refined plan: Use a ref or state for style.
  const [dynamicAspectRatio, setDynamicAspectRatio] = useState(1.3)

  useEffect(() => {
    // Open the book shortly after mount
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, ANIMATION_CONFIG.openDelay * 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const confettiDelayMs = (ANIMATION_CONFIG.duration + 1.0) * 1000

      const confettiTimer = setTimeout(() => {
        const end = Date.now() + 1000
        const colors = ["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"]

        ;(function frame() {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
          })
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
          })

          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        })()
      }, confettiDelayMs)

      return () => clearTimeout(confettiTimer)
    }
  }, [isOpen])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const [isInsideVisible, setIsInsideVisible] = useState(false)

  // Fallback cover if none provided
  const finalCoverUrl = coverUrl || "/images/placeholder-cover.jpg"

  return (
    <div className={cn("relative w-full max-w-md mx-auto p-4 perspective-[1200px]", className)}>
      <div className="flex gap-2 items-center justify-center relative">
        {/* The 3D Book Container */}
        <div className="relative w-auto h-[275px] mt-4 mb-2 max-w-[300px] aspect-[0.66]">
          {/* The Book Itself */}
          <motion.div
            className="relative w-full h-full preserve-3d origin-left"
            initial={false}
            animate={{
              rotateY: isOpen ? -10 : 0,
              x: isOpen ? "100%" : "0%",
            }}
            transition={{ duration: ANIMATION_CONFIG.duration, ease: "easeInOut" }}
          >
            {/* RIGHT PAGE (The "Book Block" that stays underneath) */}
            <div className="absolute inset-0 w-full h-full bg-[#fdfbf6] rounded-r-md shadow-lg border-l border-stone-200">
              {/* Binding Shadow (Left Inset) */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_12px_0_15px_-4px_rgba(30,20,10,0.15)] z-10 rounded-r-md" />
              {/* Page texture/lines */}
              <div className="absolute inset-4 border-2 border-stone-100/50" />
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-stone-200/50" />{" "}
              {/* Edge depth */}
            </div>

            {/* FRONT COVER ASSEMBLY (Flips Open) */}
            <motion.div
              className="absolute inset-0 w-full h-full origin-left preserve-3d z-20"
              initial={{ rotateY: 0 }}
              animate={{
                rotateY: isOpen ? -180 : 0,
              }}
              transition={{
                duration: ANIMATION_CONFIG.duration,
                type: "spring",
                stiffness: 40,
                damping: 12,
              }}
              onUpdate={(latest) => {
                // Track rotation to toggle visibility state at 90 degrees (halfway)
                if (typeof latest.rotateY === "number") {
                  const angle = latest.rotateY
                  if (angle < -90 && !isInsideVisible) setIsInsideVisible(true)
                  if (angle > -90 && isInsideVisible) setIsInsideVisible(false)
                }
              }}
            >
              {/* FRONT FACE (Outer Cover) */}
              {!isInsideVisible && (
                <div className="absolute inset-0 w-full h-full bg-amber-800 rounded-r-md shadow-xl overflow-hidden border-2 border-amber-900/20 backface-hidden">
                  {/* Spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent z-10" />

                  {/* Cover Image */}
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt="Book Cover"
                      className="h-full opacity-90 mix-blend-overlay aspect-2/3"
                      onLoad={(e) => {
                        const img = e.currentTarget
                        if (img.naturalWidth && img.naturalHeight) {
                          setDynamicAspectRatio(img.naturalWidth / img.naturalHeight)
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-700 text-amber-100 p-6 text-center">
                      <span className="font-serif font-bold text-lg opacity-50">
                        TaleTrail Journey
                      </span>
                    </div>
                  )}

                  {/* Cover Texture Overlay */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-multiply" />
                </div>
              )}

              {/* BACK FACE (Inside Cover - Functional Area) */}
              {isInsideVisible && (
                <div
                  className="absolute inset-0 w-full h-full bg-[#f8f5e6] rounded-l-md overflow-hidden backface-hidden"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {/* Binding Shadow (Right Inset) */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_-12px_0_15px_-4px_rgba(30,20,10,0.15)] z-20 rounded-l-md" />

                  {/* Parchment/Instruction Content - Only fully render/animate when visible */}
                  <ParchmentFrame
                    variant="decorated"
                    className="h-full flex flex-col items-center justify-center text-center shadow-inner"
                  >
                    <div className="space-y-2 w-full relative z-10 scale-90">
                      {" "}
                      {/* Slight scale down to fit */}
                      <div className="space-y-2">
                        {/* Handwriting Animation for URL */}
                        <div className="h-4 flex items-center justify-center">
                          <TypewriterText
                            text="TaleTrail.org"
                            delay={ANIMATION_CONFIG.urlWriteDelay}
                            className="font-handwriting font-bold text-amber-800 tracking-wide text-xl"
                          />
                        </div>

                        {/* Handwriting Animation for Code */}
                        <div
                          className="relative group/code cursor-pointer flex justify-center mt-2"
                          onClick={handleCopy}
                        >
                          <div className="font-handwriting text-2xl font-bold text-stone-800 tracking-widest border-2 border-dashed border-stone-300 rounded px-3 py-1 bg-white/50 min-w-[160px] min-h-[48px] flex items-center justify-center">
                            <TypewriterText
                              text={code}
                              delay={
                                ANIMATION_CONFIG.urlWriteDelay + ANIMATION_CONFIG.codeWriteDelay
                              }
                            />
                          </div>

                          <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-700 hover:text-amber-900 hover:bg-amber-100/50"
                            >
                              {copied ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ParchmentFrame>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
