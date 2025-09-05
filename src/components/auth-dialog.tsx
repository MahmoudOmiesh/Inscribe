"use client";

import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Spinner } from "./spinner";
import { GithubIcon, GoogleIcon } from "./brand-icons";
import { DialogTitle } from "@radix-ui/react-dialog";

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
  const buttonVariant = initialType === "sign-in" ? "ghost-text" : "default";
  const buttonText = initialType === "sign-in" ? "Sign In" : "Sign Up";
  const { title } = dialogTexts[initialType];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="block p-0 sm:max-w-[425px]">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <AuthContent initialType={initialType} />
      </DialogContent>
    </Dialog>
  );
}

export function AuthContent({
  initialType,
  callbackURL,
}: {
  initialType: "sign-in" | "sign-up";
  callbackURL?: string;
}) {
  const [type, setType] = useState<"sign-in" | "sign-up">(initialType);
  const { title, description, badgeText, badgeLinkText } = dialogTexts[type];

  const googleSignInMutation = useMutation({
    mutationFn: () =>
      authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL && `/${callbackURL}`,
      }),
  });
  const githubSignInMutation = useMutation({
    mutationFn: () =>
      authClient.signIn.social({
        provider: "github",
        callbackURL: callbackURL && `/${callbackURL}`,
      }),
  });

  const isLoading =
    googleSignInMutation.isPending || githubSignInMutation.isPending;

  return (
    <div className="grid gap-6 p-6">
      <div className="flex flex-col items-center text-center">
        <p className="text-3xl font-bold">{title}</p>
        <p className="text-base">{description}</p>
      </div>
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
          <GithubIcon className="size-4 text-black dark:text-white" /> Continue
          with Github
          {githubSignInMutation.isPending && (
            <Spinner className="absolute top-1/2 right-4 -translate-y-1/2" />
          )}
        </Button>
      </div>
      <div className="flex flex-col gap-0 sm:flex-col sm:justify-center">
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
      </div>
    </div>
  );
}
