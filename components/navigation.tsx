"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, PlusCircle } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-xl">BookTracker</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant={pathname === "/" ? "default" : "ghost"} asChild>
            <Link href="/">Search</Link>
          </Button>
          <Button variant={pathname === "/generate" ? "default" : "ghost"} asChild>
            <Link href="/generate">
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Code
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
