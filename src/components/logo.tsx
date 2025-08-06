import { PenTool } from "lucide-react";

export function Logo() {
  return (
    <div className="from-primary to-primary/80 flex h-8 w-8 items-center justify-center rounded-sm bg-gradient-to-br">
      <PenTool className="h-5 w-5 text-white" />
    </div>
  );
}
