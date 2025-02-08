
interface AgentCardProps {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
}

const AgentCard = ({ name, description, category, imageUrl }: AgentCardProps) => {
  return (
    <div className="glass-effect rounded-xl overflow-hidden card-hover border">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
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
        <button className="mt-4 w-full px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          Download
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
