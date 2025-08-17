import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner } from "./spinner";

export function ErrorSuspenseBoundary({
  errorFallback,
  errorMessage,
  suspenseFallback,
  children,
}: {
  errorFallback?: React.ReactNode;
  errorMessage?: string;
  suspenseFallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={
        errorFallback ?? (
          <div className="flex h-16 items-center justify-center p-2">
            <p className="text-muted-foreground text-center text-sm italic">
              {errorMessage ?? "Something went wrong."}
            </p>
          </div>
        )
      }
    >
      <Suspense
        fallback={
          suspenseFallback ?? (
            <div className="flex h-16 items-center justify-center p-2">
              <Spinner />
            </div>
          )
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
