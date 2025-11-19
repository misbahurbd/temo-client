import { Logo } from "@/components/shared/logo";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div
            className="relative animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            <Logo className="scale-110" />
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading...
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </div>
  );
}
