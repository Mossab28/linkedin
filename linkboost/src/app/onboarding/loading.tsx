import { cn } from "@/lib/utils/cn";
import { ProgressBar } from "@/components/ui/progress-bar";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-zinc-800/60 rounded-lg animate-pulse",
        className
      )}
    />
  );
}

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col">
      {/* Progress bar skeleton */}
      <div className="w-full max-w-lg mx-auto px-6 pt-8">
        <ProgressBar value={0} />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Title skeleton */}
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Card skeletons */}
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="w-full max-w-lg mx-auto px-6 pb-8">
        <div className="flex items-center justify-end">
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
