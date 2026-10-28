import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-lg animate-pulse bg-[--surface-subtle]", className)}
      aria-hidden
    />
  );
}

export function FeedCardSkeleton() {
  return (
    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--surface-border)" }}>
      <div className="flex gap-3">
        <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="flex gap-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
          <div className="flex gap-6 pt-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TokenCardSkeleton() {
  return (
    <div className="card-3d p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
      <Skeleton className="h-12 rounded-lg" />
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 rounded-lg" />)}
      </div>
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--surface-border)", background: "var(--surface-main)" }}>
      <div className="flex">
        {/* Character panel skeleton */}
        <div className="w-[130px] min-h-[200px] flex-shrink-0" style={{ background: "var(--surface-subtle)" }} />
        {/* Content skeleton */}
        <div className="flex-1 p-4 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
