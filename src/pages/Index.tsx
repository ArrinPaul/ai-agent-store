
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, Zap, Crown, Users, Download, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const featuredStats = [
    { icon: Users, label: "Active Users", value: "2.5M+", color: "text-blue-500" },
    { icon: Download, label: "Downloads", value: "50M+", color: "text-green-500" },
    { icon: Star, label: "Average Rating", value: "4.8", color: "text-yellow-500" },
    { icon: Zap, label: "Apps Available", value: "10K+", color: "text-purple-500" }
  ];

  const categories = [
    { name: "Productivity", icon: "📊", apps: "1,247", trending: true },
    { name: "Entertainment", icon: "🎮", apps: "3,421", trending: false },
    { name: "Education", icon: "📚", apps: "892", trending: true },
    { name: "Health & Fitness", icon: "💪", apps: "654", trending: false }
  ];

  const topApps = [
    { name: "TaskMaster Pro", category: "Productivity", rating: 4.8, downloads: "500K+", price: "$9.99" },
    { name: "FitTrack Elite", category: "Health", rating: 4.6, downloads: "250K+", price: "Free" },
    { name: "MindfulMedit", category: "Wellness", rating: 4.9, downloads: "1M+", price: "$4.99" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-8 pb-16">
        <motion.div 
          className="text-center space-y-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              New Platform
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-transparent bg-clip-text">
            Discover Amazing AI Agents
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your gateway to the world's best AI-powered applications. Download, rate, and discover apps that enhance your productivity and creativity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/apps">
                Explore Apps
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <Link to="/profile">
                Developer Console
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {featuredStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Browse Categories</h2>
            <Button variant="ghost" asChild>
              <Link to="/apps">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{category.apps} apps</p>
                  {category.trending && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Top Apps Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              Top Charts
            </h2>
            <Button variant="ghost" asChild>
              <Link to="/apps">
                See All Rankings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topApps.map((app, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">{app.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{app.rating}</span>
                    </div>
                    <span className="text-muted-foreground">{app.downloads}</span>
                    <span className="font-semibold text-primary">{app.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-6 opacity-90">
                Join millions of users discovering and downloading amazing AI applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Link to="/apps">Start Exploring</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/auth">Sign Up Free</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
