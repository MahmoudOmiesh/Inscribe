import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Check,
  FileDown,
  Sparkles,
  SlidersHorizontal,
  PencilLineIcon,
} from "lucide-react";

const FEATURES = [
  {
    icon: PencilLineIcon,
    title: "Delightful editor",
    description:
      "Powerful formatting, slash commands, emoji, lists and more — all with a snappy UX.",
  },
  {
    icon: Zap,
    title: "Local-first sync",
    description:
      "Your notes are available instantly — with background sync when you go online.",
  },
  {
    icon: Check,
    title: "Organize with ease",
    description:
      "Folders, favorites, and fast search to keep everything tidy and findable.",
  },
  {
    icon: FileDown,
    title: "One-click export",
    description: "Export notes as Markdown or HTML whenever you need.",
  },
  {
    icon: Sparkles,
    title: "Inline AI assistance",
    description:
      "Ask AI directly in the editor to generate and refine text, or continue writing in context.",
  },
  {
    icon: SlidersHorizontal,
    title: "Flexible layout & view",
    description:
      "Switch fonts, toggle compact text, go full width, and lock notes when needed.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-36">
      <MaxWidthWrapper>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-balance sm:text-4xl">
            Everything you need to think{" "}
            <span className="text-gradient-main">clearly</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Thoughtful details and speed where it matters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="relative">
              {/* <div className="from-primary to-primary absolute inset-0.5 -z-10 rounded-lg bg-gradient-to-tl via-indigo-500 blur-sm"></div> */}
              <Card className="">
                <CardContent>
                  <div className="bg-primary/10 text-primary mb-3 grid size-10 place-items-center rounded-md">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
