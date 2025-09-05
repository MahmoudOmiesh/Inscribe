import { CTA } from "./_components/cta";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { Editor } from "./_components/editor";

export default function Home() {
  return (
    <div className="relative flex-1">
      <Hero />
      <Editor />
      <Features />
      <CTA />
    </div>
  );
}
