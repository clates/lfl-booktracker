
import { Tag, Send, Map } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      title: "Tag It",
      description: "Generate a unique code for your book and write it on the inside cover.",
      icon: Tag,
    },
    {
      title: "Release It",
      description: "Leave your book in a Little Free Library or pass it to a friend.",
      icon: Send,
    },
    {
      title: "Watch It Go",
      description: "Get notified when someone finds your book and continues its journey.",
      icon: Map,
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900 rounded-lg my-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join the community of book lovers tracking the journey of their favorite stories.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
