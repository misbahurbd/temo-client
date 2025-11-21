import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      {/* Left side panel - hidden on mobile, visible on large screens */}
      <div className="hidden lg:block w-1/2 bg-linear-to-t from-primary to-primary/50 h-full rounded-lg"></div>
      
      {/* Right side - form container */}
      <div className="w-full lg:w-1/2 px-20 py-24 flex flex-col gap-8">
        {/* Logo skeleton */}
        <div className="flex items-center justify-center">
          <Skeleton className="h-12 w-32" />
        </div>

        {/* Form card skeleton */}
        <div className="space-y-4 p-8 border rounded-sm bg-white w-full max-w-md mx-auto">
          {/* Title skeleton */}
          <div className="space-y-2 mb-2">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          {/* Form fields skeleton */}
          <div className="space-y-5">
            {/* First row - for register page (first name, last name) */}
            <div className="flex gap-5">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Email field skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Password field skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Confirm password field skeleton (for register) */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Submit button skeleton */}
          <Skeleton className="h-10 w-full mt-4" />

          {/* Link skeleton */}
          <div className="flex items-center justify-center mt-4">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

