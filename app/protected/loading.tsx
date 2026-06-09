import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedLoading() {
  return (
    <div>
      {/* 1. Ghost Navigation (Prevents vertical layout shift) */}
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-sm" /> 
        </div>
      </nav>

      {/* 2. Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="animate-in fade-in duration-500">
          
          {/* Header matching text-5xl (h-12) and text-lg (h-7) */}
          <header className="mb-12">
            <Skeleton className="h-12 w-64 md:w-80 mb-4 rounded-md" />
            <Skeleton className="h-7 w-48 rounded-md" />
          </header>

          {/* Checklist Area matching flex-col gap-2 */}
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                {/* Large touch-target checkbox skeleton */}
                <Skeleton className="h-6 w-6 rounded shrink-0" /> 
                {/* Task text skeleton (randomized slightly by using max-widths) */}
                <div className="w-full space-y-2">
                   <Skeleton className={`h-6 rounded-sm ${i % 2 === 0 ? 'w-3/4' : 'w-5/6'}`} />
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
}