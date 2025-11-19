import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  onlyIcon = false,
}: {
  className?: string;
  onlyIcon?: boolean;
}) => {
  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold",
          className
        )}
      >
        T
      </div>
      {!onlyIcon && (
        <span className="text-xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Temo
        </span>
      )}
    </div>
  );
};
