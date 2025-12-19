import Image from "next/image"
import { ParchmentFrame } from "@/components/ui/parchment-frame"

export function HowItWorks() {
  const steps = [
    {
      title: "Tag It",
      description: "Generate a unique code for your book and write it on the inside cover.",
      image: "/images/heros/boy-write-book-cropped.png",
      alt: "Illustration of a boy writing in a book",
    },
    {
      title: "Release It",
      description: "Leave your book in a Little Free Library or pass it to a friend.",
      image: "/images/heros/boy-book-library-upscale.png",
      alt: "Illustration of a boy placing a book in a library",
    },
    {
      title: "Watch It Go",
      description: "Get notified when someone finds your book and continues its journey.",
      image: "/images/heros/magnify-upscale.png",
      alt: "Illustration of a magnifying glass",
    },
  ]

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 my-8 px-2">
      <ParchmentFrame variant="wavy" className="w-full">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
              How It Works
            </h2>
            <p className="hidden md:block max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-serif italic">
              Join the community of book lovers tracking the journey of their favorite stories.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-8 md:gap-4 md:flex-col md:items-center md:text-center md:gap-4 ${
                index % 2 === 0 ? "flex-row text-left" : "flex-row-reverse text-right"
              }`}
            >
              <div className="relative w-32 h-32 shrink-0 md:w-48 md:h-48">
                <Image src={step.image} alt={step.alt} fill className="object-contain" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-primary">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ParchmentFrame>
    </div>
  )
}
