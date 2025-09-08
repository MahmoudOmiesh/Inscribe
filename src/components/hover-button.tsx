"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function HoverButton({
  children,
  onClick,
  className,
  title,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const button = (
    <div
      role="button"
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "icon",
        }),
        "size-5 rounded-sm transition-opacity duration-100 group-hover/button:opacity-100 group-focus-visible/button:opacity-100 focus:opacity-100 lg:opacity-0 dark:hover:bg-gray-100/10",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );

  if (!title) {
    return button;
  }

  return (
    <TooltipProvider>
      <Tooltip disableHoverableContent={true}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          variant="muted"
          arrow={false}
          sideOffset={8}
          className="pointer-events-none rounded-sm px-2 py-1.5"
        >
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
