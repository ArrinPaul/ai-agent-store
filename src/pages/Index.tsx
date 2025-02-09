import Navigation from "@/components/Navigation";
import FeaturedAgent from "@/components/FeaturedAgent";
import AgentCard from "@/components/AgentCard";
import BottomMenu from "@/components/BottomMenu";
import { useState } from "react";

const agents = [
  {
    name: "Writing Assistant",
    description: "Enhance your writing with AI-powered suggestions and improvements.",
    category: "Productivity",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    downloads: 1234,
  },
  {
    name: "Code Companion",
    description: "Your AI pair programmer that helps you write better code faster.",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    downloads: 2345,
  },
  {
    name: "Design Assistant",
    description: "Create beautiful designs with AI-powered suggestions and templates.",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    downloads: 3456,
  },
  {
    name: "Research Helper",
    description: "Accelerate your research with AI-powered insights and analysis.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80",
    downloads: 4567,
  },
];

const mostSearched = [
  {
    name: "AI Writing Tool",
    description: "A tool to help you write better and faster.",
    category: "Productivity",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    downloads: 5000,
  },
  {
    name: "AI Code Helper",
    description: "Get coding assistance with AI.",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
    downloads: 3000,
  },
  {
    name: "AI Design Assistant",
    description: "Design with the help of AI.",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
    downloads: 2000,
  },
  {
    name: "AI Research Assistant",
    description: "Research made easy with AI.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
    downloads: 1500,
  },
];

const topDownloaded = agents.sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 4);

const featuredApps = [
  {
    name: "Super AI Assistant",
    description: "The most advanced AI assistant for all your needs.",
    category: "Productivity",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80",
    downloads: 10000,
  },
  {
    name: "AI Music Generator",
    description: "Create music with the help of AI.",
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
    downloads: 8000,
  },
  {
    name: "AI Video Editor",
    description: "Edit videos effortlessly with AI.",
    category: "Video",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
    downloads: 6000,
  },
  {
    name: "AI Chatbot",
    description: "Engage with users using AI chatbots.",
    category: "Chat",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
    downloads: 4000,
  },
];

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <FeaturedAgent />
          
          <div className="mt-12 p-6 bg-secondary/20 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">1.2M+</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
              <div className="bg-background p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Active Agents</p>
              </div>
              <div className="bg-background p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">50k+</p>
                <p className="text-sm text-muted-foreground">Daily Users</p>
              </div>
              <div className="bg-background p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Most Searched This Week</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mostSearched.map((agent) => (
                <AgentCard key={agent.name} {...agent} />
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Top Downloaded</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDownloaded.map((agent) => (
                <AgentCard key={agent.name} {...agent} />
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Featured Apps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredApps.map((agent) => (
                <AgentCard key={agent.name} {...agent} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Index;
