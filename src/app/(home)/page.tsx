import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Stars, Zap } from "lucide-react";
import Link from "next/link";
import { Hero } from "./_components/hero";

export default function Home() {
  return (
    <div className="relative flex-1">
      <Hero />

      <section id="features" className="bg-muted/30 py-16 sm:py-24">
        <MaxWidthWrapper>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-balance sm:text-4xl">
              Everything you need to think clearly
            </h2>
            <p className="text-muted-foreground mt-2">
              Thoughtful details and speed where it matters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="bg-primary/10 text-primary mb-3 grid size-10 place-items-center rounded-md">
                  <Stars className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">Delightful editor</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Powerful formatting, slash commands, emoji, lists and more —
                  all with a snappy UX.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-primary/10 text-primary mb-3 grid size-10 place-items-center rounded-md">
                  <Zap className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">Offline-first sync</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Your notes are available instantly — with background sync when
                  you go online.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-primary/10 text-primary mb-3 grid size-10 place-items-center rounded-md">
                  <Check className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">Organize with ease</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Folders, favorites, and fast search to keep everything tidy
                  and findable.
                </p>
              </CardContent>
            </Card>
          </div>
        </MaxWidthWrapper>
      </section>

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
