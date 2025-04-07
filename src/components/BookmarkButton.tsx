
import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  const { session } = useAuth();

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const toggleBookmark = async () => {
    if (!session?.user) {
      toast.error("Please log in to bookmark agents");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get current bookmarks
      const { data, error } = await supabase
        .from("profiles")
        .select("bookmarks")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      
      // Update bookmarks array
      const bookmarks = data.bookmarks as string[] || [];
      const updatedBookmarks = isBookmarked
        ? bookmarks.filter(id => id !== appId)
        : [...bookmarks, appId];
      
      // Save updated bookmarks
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ bookmarks: updatedBookmarks })
        .eq("id", session.user.id);
      
      if (updateError) throw updateError;
      
      const newBookmarkedState = !isBookmarked;
      setIsBookmarked(newBookmarkedState);
      
      if (onBookmarkChange) {
        onBookmarkChange(newBookmarkedState);
      }
      
      toast.success(isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks");
    } catch (error) {
      console.error("Error updating bookmarks:", error);
      toast.error("Failed to update bookmarks");
    } finally {
      setIsLoading(false);
    }
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
