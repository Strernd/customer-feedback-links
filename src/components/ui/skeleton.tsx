/**
 * Skeleton loading components that match final content layout
 * to prevent layout shift during data loading
 */

export function FeedbackPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-accent/3 via-transparent to-transparent" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="h-4 w-32 bg-card animate-pulse rounded" />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-start justify-center p-6 pt-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Profile Card Skeleton */}
          <div className="p-6 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-card-hover rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-32 bg-card-hover animate-pulse rounded" />
                <div className="h-4 w-24 bg-card-hover animate-pulse rounded" />
              </div>
            </div>
          </div>

          {/* Form Card Skeleton */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-6">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-card-hover animate-pulse rounded" />
              <div className="h-4 w-full bg-card-hover animate-pulse rounded" />
            </div>
            <div className="h-32 w-full bg-card-hover animate-pulse rounded" />
            <div className="h-40 w-full bg-card-hover animate-pulse rounded" />
            <div className="h-12 w-full bg-card-hover animate-pulse rounded" />
          </div>
        </div>
      </main>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="h-5 w-32 bg-card animate-pulse rounded" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-24 bg-card animate-pulse rounded" />
              <div className="h-8 w-8 bg-card animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Card Skeleton */}
          <div className="p-6 bg-card rounded-xl border border-border">
            <div className="space-y-4">
              <div className="h-6 w-48 bg-card-hover animate-pulse rounded" />
              <div className="h-4 w-64 bg-card-hover animate-pulse rounded" />
              <div className="h-10 w-full bg-card-hover animate-pulse rounded" />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 bg-card rounded-xl border border-border text-center"
              >
                <div className="h-8 w-16 mx-auto bg-card-hover animate-pulse rounded mb-2" />
                <div className="h-4 w-12 mx-auto bg-card-hover animate-pulse rounded" />
              </div>
            ))}
          </div>

          {/* List Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 bg-card rounded-xl border border-border space-y-3"
              >
                <div className="h-4 w-24 bg-card-hover animate-pulse rounded" />
                <div className="h-16 w-full bg-card-hover animate-pulse rounded" />
                <div className="h-3 w-32 bg-card-hover animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
