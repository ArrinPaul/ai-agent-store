
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AgentCardProps {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  downloads?: number;
}

const AgentCard = ({ name, description, category, imageUrl, downloads = 0 }: AgentCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Download started successfully!");
    } catch (error) {
      toast.error("Failed to start download");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="glass-effect rounded-xl overflow-hidden card-hover border transition-all duration-300 hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-primary/60 uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-lg font-semibold mt-1">{name}</h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{downloads} downloads</span>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
