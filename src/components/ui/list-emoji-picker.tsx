"use client";

import {
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
  EmojiPicker as EmojiPickerPrimitive,
} from "frimousse";
import { LoaderIcon, SearchIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

function ListEmojiPicker({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
      className={cn(
        "bg-popover text-popover-foreground isolate flex h-full w-fit flex-col overflow-hidden rounded-md",
        className,
      )}
      data-slot="emoji-picker"
      {...props}
      columns={1}
    />
  );
}

function ListEmojiPickerSearch({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
  return (
    <div
      className={cn("flex h-9 items-center gap-2 border-b px-3", className)}
      data-slot="emoji-picker-search-wrapper"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <EmojiPickerPrimitive.Search
        className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
        data-slot="emoji-picker-search"
        {...props}
      />
    </div>
  );
}

function ListEmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div
      {...props}
      className="max-w-[250px] scroll-my-1 px-1"
      data-slot="emoji-picker-row"
    >
      {children}
    </div>
  );
}

function ListEmojiPickerEmoji({
  emoji,
  className,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <Button
      {...props}
      data-slot="emoji-picker-emoji"
      variant={
        (props as { "data-active": undefined | string })["data-active"] !==
        undefined
          ? "default"
          : "ghost"
      }
      className={cn("max-w-full flex-1 justify-start px-2 text-sm", className)}
    >
      <span>{emoji.emoji}</span>
      <span className="truncate text-left font-(family-name:--font-inter)">
        {emoji.label}
      </span>
    </Button>
  );
}

function ListEmojiPickerCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      className="bg-popover text-muted-foreground px-3 pt-3.5 pb-2 text-xs leading-none"
      data-slot="emoji-picker-category-header"
    >
      {category.label}
    </div>
  );
}

function ListEmojiPickerContent({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
  return (
    <EmojiPickerPrimitive.Viewport
      className={cn("relative flex-1 outline-hidden", className)}
      data-slot="emoji-picker-viewport"
      {...props}
    >
      <EmojiPickerPrimitive.Loading
        className="text-muted-foreground absolute inset-0 flex items-center justify-center"
        data-slot="emoji-picker-loading"
      >
        <LoaderIcon className="size-4 animate-spin" />
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty
        className="text-muted-foreground absolute inset-0 flex items-center justify-center text-sm"
        data-slot="emoji-picker-empty"
      >
        No emoji found.
      </EmojiPickerPrimitive.Empty>
      <EmojiPickerPrimitive.List
        className="pb-1 select-none"
        components={{
          Row: ListEmojiPickerRow,
          Emoji: ListEmojiPickerEmoji,
          CategoryHeader: ListEmojiPickerCategoryHeader,
        }}
        data-slot="emoji-picker-list"
      />
    </EmojiPickerPrimitive.Viewport>
  );
}

export { ListEmojiPicker, ListEmojiPickerSearch, ListEmojiPickerContent };
