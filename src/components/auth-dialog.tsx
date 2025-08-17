import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Spinner } from "./spinner";
import { GithubIcon, GoogleIcon } from "./brand-icons";

const dialogTexts = {
  "sign-in": {
    title: "Welcome Back",
    description: "Sign in to your account",
    badgeText: "Don't have an account?",
    badgeLinkText: "Create an account",
  },
  "sign-up": {
    title: "Create an account",
    description: "Create an account to get started",
    badgeText: "Already have an account?",
    badgeLinkText: "Sign in to your account",
  },
};

export function AuthDialog({
  initialType,
}: {
  initialType: "sign-in" | "sign-up";
}) {
  const [type, setType] = useState<"sign-in" | "sign-up">(initialType);
  const url = usePathname();

  // never change the button variant or text after the dialog is opened
  const buttonVariant = initialType === "sign-in" ? "ghost-text" : "default";
  const buttonText = initialType === "sign-in" ? "Sign In" : "Sign Up";

  const { title, description, badgeText, badgeLinkText } = dialogTexts[type];

  const googleSignInMutation = useMutation({
    mutationFn: () =>
      authClient.signIn.social({
        provider: "google",
        callbackURL: url,
      }),
  });

  const githubSignInMutation = useMutation({
    mutationFn: () =>
      authClient.signIn.social({
        provider: "github",
        callbackURL: url,
      }),
  });

  const isLoading =
    googleSignInMutation.isPending || githubSignInMutation.isPending;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="gap-6 sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Button
            className="relative"
            variant="outline"
            disabled={isLoading}
            onClick={() => googleSignInMutation.mutate()}
          >
            <GoogleIcon className="size-4" /> Continue with Google
            {googleSignInMutation.isPending && (
              <Spinner className="absolute top-1/2 right-4 -translate-y-1/2" />
            )}
          </Button>
          <Button
            className="relative"
            variant="outline"
            disabled={isLoading}
            onClick={() => githubSignInMutation.mutate()}
          >
            <GithubIcon className="size-4 text-black dark:text-white" />{" "}
            Continue with Github
            {githubSignInMutation.isPending && (
              <Spinner className="absolute top-1/2 right-4 -translate-y-1/2" />
            )}
          </Button>
        </div>
        <DialogFooter className="flex-col gap-0 sm:flex-col sm:justify-center">
          <div className="relative flex justify-center">
            <Badge variant="secondary" className="rounded-none">
              {badgeText}
            </Badge>
            <div className="bg-border absolute top-1/2 right-0 left-0 -z-10 h-px -translate-y-1/2" />
          </div>
          <Button
            className="self-center"
            variant="link"
            onClick={() => setType(type === "sign-in" ? "sign-up" : "sign-in")}
          >
            {badgeLinkText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
