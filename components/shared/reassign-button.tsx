"use client";

import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ReassignButton = ({
  onClick,
  isLoading,
  disabled,
  taskCount,
}: {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  taskCount: number;
}) => {
  const isDisabled = disabled || taskCount === 0;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={cn(
        "group relative overflow-hidden cursor-pointer rounded-full border bg-transparent px-4 py-2 font-medium transition-all duration-300",
        "hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-foreground",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-1000 hover:before:translate-x-full",
        !isDisabled && "border-primary text-primary"
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        <Sparkles
          className={cn(
            "h-4 w-4 transition-all delay-75 duration-500",
            "group-hover:rotate-180 delay-0 group-hover:scale-110",
            !isDisabled && "animate-pulse",
            isLoading && "animate-spin"
          )}
        />

        <span className="font-semibold">Reassign Tasks ({taskCount})</span>
      </span>

      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-full bg-primary/30 opacity-0 transition-opacity duration-300 active:opacity-100" />
    </Button>
  );
};
