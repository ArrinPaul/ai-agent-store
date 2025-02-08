
import Navigation from "@/components/Navigation";
import FeaturedAgent from "@/components/FeaturedAgent";
import AgentCard from "@/components/AgentCard";

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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <FeaturedAgent />
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Popular AI Agents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.name} {...agent} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
