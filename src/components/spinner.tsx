import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
    },
    color: {
      default: "text-inherit",
      secondary: "text-secondary",
      success: "text-green-500",
      warning: "text-yellow-500",
      error: "text-red-500",
    },
  },
  defaultVariants: {
    size: "sm",
    color: "default",
  },
});

export function Spinner({
  size,
  color,
  className,
}: VariantProps<typeof spinnerVariants> & { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn(spinnerVariants({ size, color }))} />
    </div>
  );
}
