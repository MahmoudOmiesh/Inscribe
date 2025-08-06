import { GithubIcon } from "./brand-icons";
import { MaxWidthWrapper } from "./max-width-wrapper";

export function Footer() {
  return (
    <footer className="bg-background border-t py-6">
      <MaxWidthWrapper className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Inscribe. All rights reserved.
        </p>
        <div>
          <a
            href="https://github.com/MahmoudOmiesh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="text-muted-foreground hover:text-foreground size-4" />
          </a>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
