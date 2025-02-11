
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  downloads?: number;
}

const AgentCard = ({ id, name, description, category, image_url, downloads = 0 }: AgentCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Update downloads count in Supabase
      const { error } = await supabase
        .from("apps")
        .update({ downloads: (downloads || 0) + 1 })
        .eq("id", id);

      if (error) throw error;

      toast.success("Download started successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to start download");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-lg shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="text-xs font-medium bg-primary/20 px-2 py-1 rounded-full backdrop-blur-sm">
            {category}
          </span>
          <h3 className="text-xl font-bold mt-2">{name}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{downloads} downloads</span>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Getting..." : "Get"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
