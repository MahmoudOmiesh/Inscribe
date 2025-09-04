import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilLineIcon, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] pt-60 pb-30 text-center">
      <DiagonalFadeGrid direction="top-right" />
      <DiagonalFadeGrid direction="bottom-left" />

      <MaxWidthWrapper className="relative z-10 flex flex-col items-center gap-4">
        <Badge className="rounded-sm">
          <PencilLineIcon /> Scribble Smarter With Inscribe
        </Badge>
        <h1 className="mt-4 max-w-[20ch] text-5xl leading-14 font-extrabold tracking-tight text-balance">
          Capture ideas. Organize everything. Think in{" "}
          <span className="from-primary bg-gradient-to-tl via-violet-500 to-purple-500 bg-clip-text text-transparent">
            Inscribe.
          </span>
        </h1>
        <p className="text-muted-foreground max-w-[70ch] text-lg text-pretty">
          Write, organize, and sync your thoughts seamlessly across all your
          devices. Experience fast performance with local-first technology and a
          beautiful, distraction-free editor.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/notes">
              <Zap className="size-4" />
              Get started
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#features">Explore features</a>
          </Button>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

function DiagonalFadeGrid({
  direction,
}: {
  direction: "top-right" | "bottom-left";
}) {
  const at = direction === "top-right" ? "100% 100%" : "0% 0%";

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
        linear-gradient(to right, color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 1px),
        linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 1px)
      `,
        backgroundSize: "32px 32px",
        WebkitMaskImage: `radial-gradient(ellipse 60% 100% at ${at}, var(--background) 10%, transparent 90%)`,
        maskImage: `radial-gradient(ellipse 60% 100% at ${at}, var(--background) 10%, transparent 90%)`,
      }}
    />
  );
}
