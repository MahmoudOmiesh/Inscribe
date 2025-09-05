"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "./spinner";
import Link from "next/link";
import { Logo } from "./logo";
import { ProfileDropdown } from "./profile-dropdown";
import { AuthDialog } from "./auth-dialog";
import { ThemeSwitch } from "./ui/theme-switch";
import { MaxWidthWrapper } from "./max-width-wrapper";

export function Header() {
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = !!session?.user;

  return (
    <header className="fixed inset-x-0 top-5 z-50 px-4">
      <MaxWidthWrapper className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex items-center justify-between rounded-full border px-6 py-2 backdrop-blur sm:px-8 sm:py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="hidden text-2xl font-bold sm:block">Inscribe</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <div className="flex gap-2">
            {isPending ? (
              <div className="grid h-9 place-items-center">
                <Spinner size="md" />
              </div>
            ) : isSignedIn ? (
              <ProfileDropdown
                name={session.user.name}
                email={session.user.email}
                photoUrl={session.user.image ?? ""}
              />
            ) : (
              <>
                <AuthDialog initialType="sign-in" />
                <AuthDialog initialType="sign-up" />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
