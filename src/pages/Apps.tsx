
import Navigation from "@/components/Navigation";
import BottomMenu from "@/components/BottomMenu";
import AgentCard from "@/components/AgentCard";
import { useState } from "react";

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  downloads: number;
}

const myApps: App[] = [
  {
    id: "1",
    name: "Personal Writing Assistant",
    description: "Your personal AI writing companion that helps improve your writing style.",
    category: "Productivity",
    image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    downloads: 127,
  },
  {
    id: "2",
    name: "Code Review Bot",
    description: "AI-powered code review assistant that helps maintain code quality.",
    category: "Development",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    downloads: 89,
  },
];

const Apps = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Apps</h1>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Upload New App
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myApps.map((app) => (
              <AgentCard
                key={app.id}
                id={app.id}
                name={app.name}
                description={app.description}
                category={app.category}
                image_url={app.image_url}
                downloads={app.downloads}
              />
            ))}
          </div>

          {myApps.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">You haven't uploaded any apps yet.</p>
            </div>
          )}
        </div>
      </main>
      <BottomMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Apps;
