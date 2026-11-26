import { cn } from "@/lib/utils";

/* ============================================================
   LoadingSkeleton — Skeleton loaders for cards, text, images
   ============================================================ */

interface SkeletonProps {
  className?: string;
}

function SkeletonBase({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-md bg-surface",
        "bg-gradient-to-r from-surface via-borders/40 to-surface bg-[length:200%_100%]",
        "animate-skeleton",
        className
      )}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-busy="true" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/5" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className }: SkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading image">
      <SkeletonBase className={cn("aspect-square w-full", className)} />
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-borders overflow-hidden",
        className
      )}
      aria-busy="true"
      aria-label="Loading card"
    >
      <SkeletonBase className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <SkeletonBase className="h-5 w-2/3" />
        <SkeletonBase className="h-4 w-full" />
        <SkeletonBase className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading avatar">
      <SkeletonBase className={cn("h-12 w-12 rounded-full", className)} />
    </div>
  );
}

export default SkeletonBase;
