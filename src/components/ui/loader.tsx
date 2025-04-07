
import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg";
type Variant = "circle" | "dots" | "spinner";

interface LoaderProps {
  size?: Size;
  variant?: Variant;
  className?: string;
  text?: string;
}

const sizeMap = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const textSizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Loader({ 
  size = "md", 
  variant = "circle", 
  className,
  text
}: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      {variant === "circle" && (
        <div 
          className={cn(
            "border-2 border-current border-t-transparent text-primary rounded-full animate-spin", 
            sizeMap[size]
          )}
        />
      )}
      
      {variant === "dots" && (
        <div className="flex space-x-1">
          <div className={cn("animate-pulse rounded-full bg-primary", 
            size === "xs" ? "h-1 w-1" : "",
            size === "sm" ? "h-2 w-2" : "",
            size === "md" ? "h-2.5 w-2.5" : "",
            size === "lg" ? "h-3 w-3" : "",
          )} style={{ animationDelay: "0ms" }} />
          <div className={cn("animate-pulse rounded-full bg-primary", 
            size === "xs" ? "h-1 w-1" : "",
            size === "sm" ? "h-2 w-2" : "",
            size === "md" ? "h-2.5 w-2.5" : "",
            size === "lg" ? "h-3 w-3" : "",
          )} style={{ animationDelay: "150ms" }} />
          <div className={cn("animate-pulse rounded-full bg-primary", 
            size === "xs" ? "h-1 w-1" : "",
            size === "sm" ? "h-2 w-2" : "",
            size === "md" ? "h-2.5 w-2.5" : "",
            size === "lg" ? "h-3 w-3" : "",
          )} style={{ animationDelay: "300ms" }} />
        </div>
      )}
      
      {variant === "spinner" && (
        <svg
          className={cn("animate-spin -ml-1 mr-3 text-primary", sizeMap[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {text && (
        <span className={cn("text-muted-foreground animate-pulse", textSizeMap[size])}>
          {text}
        </span>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader size="lg" text="Loading..." />
    </div>
  );
}
