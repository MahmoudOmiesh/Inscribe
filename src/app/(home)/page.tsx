import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { Editor } from "./_components/editor";

export default function Home() {
  return (
    <div className="relative flex-1">
      <Hero />

      <Editor />

      <Features />

      <section className="py-16 sm:py-24">
        <MaxWidthWrapper>
          <div className="bg-background mx-auto max-w-2xl rounded-2xl border p-8 text-center shadow-sm">
            <div className="bg-primary/10 text-primary mx-auto mb-3 grid size-12 place-items-center rounded-full">
              <Sparkles className="size-6" />
            </div>
            <h3 className="text-2xl font-bold text-balance sm:text-3xl">
              Ready to capture your next big idea?
            </h3>
            <p className="text-muted-foreground mt-2">
              Jump into Inscribe and start writing in seconds.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/notes">
                <Button size="lg">Start now</Button>
              </Link>
              <Link href="/testing">
                <Button size="lg" variant="outline">
                  Try the demo
                </Button>
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
