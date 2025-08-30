
import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface BookmarkButtonProps {
  appId: string;
  initialBookmarked?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button";
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

const BookmarkButton = ({
  appId,
  initialBookmarked = false,
  className,
  size = "md",
  variant = "icon",
  onBookmarkChange
}: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const toggleBookmark = async () => {
    setIsLoading(true);
    
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    
    if (onBookmarkChange) {
      onBookmarkChange(newBookmarkedState);
    }
    
    toast.success(isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks");
    setIsLoading(false);
  };

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  if (variant === "button") {
    return (
      <Button
        onClick={toggleBookmark}
        disabled={isLoading}
        variant={isBookmarked ? "secondary" : "outline"}
        size="sm"
        className={cn(
          "flex items-center gap-2 transition-all",
          isBookmarked ? "bg-primary/10 text-primary" : "",
          className
        )}
        aria-label={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
      >
        <Bookmark className={cn(
          sizeClasses[size],
          isBookmarked ? "fill-primary" : ""
        )} />
        <span>{isLoading ? "..." : isBookmarked ? "Bookmarked" : "Bookmark"}</span>
      </Button>
    );
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors disabled:opacity-50",
        className
      )}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
    >
      {isLoading ? (
        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <Bookmark 
          className={cn(
            sizeClasses[size], 
            isBookmarked ? "fill-primary text-primary" : "text-white"
          )} 
        />
      )}
    </button>
  );
};

export default BookmarkButton;
