"use client";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CTA() {
  const [offsetDistance, setOffsetDistance] = useState(0);

  useEffect(() => {
    const offsetDistanceTimeout = setInterval(() => {
      setOffsetDistance((p) => (p + 0.2) % 100);
    }, 10);

    return () => clearInterval(offsetDistanceTimeout);
  }, []);

  return (
    <section className="pb-24 md:pb-36">
      <MaxWidthWrapper>
        <div
          style={{
            backgroundColor: "var(--background)",
            backgroundImage:
              "radial-gradient(at 90% 26%, #313866 0%, transparent 40%), radial-gradient(at 76% 97%, #504099 0%, transparent 50%), radial-gradient(at 57% 85%, #974ec3 0%, transparent 40%), radial-gradient(at 95% 52%, #fe7be5 0%, transparent 40%)",
          }}
          className="flex items-center justify-between rounded-2xl border p-8 sm:p-16"
        >
          <div className="max-w-sm space-y-3">
            <h3 className="text-3xl font-bold text-balance sm:text-4xl">
              Ready to <span className="text-gradient-main">capture</span> your
              next big idea?
            </h3>
            <p className="text-muted-foreground mt-2">
              Jump into Inscribe and start writing in seconds. Your next great
              idea is one click away.
            </p>
            <Button
              size="lg"
              className="relative mt-6 h-fit rounded-full border-none py-2 sm:text-base"
              asChild
            >
              <Link href="/notes">
                <div className="pointer-events-none absolute -inset-1.5 rounded-[inherit] border-2 border-transparent [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [mask-composite:intersect] [mask-clip:padding-box,border-box]">
                  <div
                    className="absolute aspect-square bg-zinc-500 bg-gradient-to-r from-pink-500/50 via-violet-500/50 to-purple-600/50"
                    style={{
                      width: "40px",
                      offsetPath: "rect(0px auto auto 0px round 40px)",
                      offsetDistance: `${offsetDistance}%`,
                    }}
                  ></div>
                </div>
                <Zap className="size-4" />
                Start Writing Now
              </Link>
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
