import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NoteOffline() {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger>
        <div className="text-muted-foreground hover:bg-accent/50 rounded-sm border p-1 text-xs">
          Offline
        </div>
      </TooltipTrigger>
      <TooltipContent
        variant="muted"
        arrow={false}
        side="bottom"
        sideOffset={8}
      >
        <p>
          You are offline. Your changes will be synced when you are back online.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
