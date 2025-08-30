
import { motion } from "framer-motion";
import FeaturedAgent from "@/components/FeaturedAgent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Download, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredApps = [
    {
      id: "1",
      name: "Task Master Pro",
      description: "Advanced task management with AI-powered scheduling",
      category: "Productivity",
      rating: 4.8,
      downloads: 12500,
      image_url: "/placeholder.svg",
      featured: true
    },
    {
      id: "2", 
      name: "Budget Buddy",
      description: "Smart personal finance tracker with expense categorization",
      category: "Finance",
      rating: 4.6,
      downloads: 8900,
      image_url: "/placeholder.svg",
      featured: true
    },
    {
      id: "3",
      name: "Fitness Flow",
      description: "Personalized workout plans and progress tracking",
      category: "Health",
      rating: 4.9,
      downloads: 15600,
      image_url: "/placeholder.svg", 
      featured: true
    }
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "50K+" },
    { icon: Download, label: "Total Downloads", value: "2M+" },
    { icon: Star, label: "Average Rating", value: "4.7" },
    { icon: Zap, label: "Apps Available", value: "500+" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI Agent Store
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover powerful AI agents and tools to supercharge your productivity, 
              creativity, and daily workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/apps">
                  Explore Apps <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/apps?category=trending">
                  View Trending
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Apps */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Featured Apps</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Handpicked applications that showcase the best of AI-powered tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeaturedAgent app={app} />
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/apps">
                  View All Apps <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
                <CardDescription className="text-lg">
                  Join thousands of users discovering amazing AI-powered applications
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">Free to Use</Badge>
                  <Badge variant="secondary">Regular Updates</Badge>
                  <Badge variant="secondary">Quality Curated</Badge>
                </div>
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/apps">
                    Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
