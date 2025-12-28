"use client"

import React, { useState } from "react"
import { BookStickerInstruction } from "@/components/book-sticker-instruction"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function BookInstructionShowcasePage() {
  const [code, setCode] = useState("ABCD-1234")
  const [key, setKey] = useState(0)

  const regenerate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let newCode = ""
    for (let i = 0; i < 4; i++) newCode += chars.charAt(Math.floor(Math.random() * chars.length))
    newCode += "-"
    for (let i = 0; i < 4; i++) newCode += chars.charAt(Math.floor(Math.random() * chars.length))
    setCode(newCode)
    setKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-stone-100 p-8 flex flex-col items-center justify-center space-y-12">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-stone-800">
          Tracking Instruction Showcase
        </h1>
        <p className="text-stone-600">Visualizing the "Inside Cover" instruction component.</p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-stone-200">
        <h2 className="text-xl font-bold text-center mb-6 text-stone-700">Component Demo</h2>

        {/* The component under test */}
        <BookStickerInstruction
          code={code}
          coverUrl="http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&source=gbs_api"
        />

        <div className="mt-8 flex justify-center">
          <Button onClick={regenerate} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate New Code
          </Button>
        </div>
      </div>
    </div>
  )
}
