import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const loadingSpinnerVariantes = cva(
  "stroke-brand-900 rounded-full animate-spin",
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-6",
        lg: "size-8",
        page: "size-16 stroke-2",
      },
      color: {
        primary: "stroke-primary",
        secondary: "stroke-primary-foreground",
        success: "stroke-success",
        destructive: "stroke-destructive",
      },
    },
    defaultVariants: {
      size: "sm",
      color: "primary",
    },
  },
);

interface LoadingSpinnerProps
  extends VariantProps<typeof loadingSpinnerVariantes> {
  className?: string;
}

const Spinner = ({ className, size, color }: LoadingSpinnerProps) => {
  return (
    <Loader2
      className={cn(loadingSpinnerVariantes({ size, color }), className)}
    />
  );
};

export default Spinner;
