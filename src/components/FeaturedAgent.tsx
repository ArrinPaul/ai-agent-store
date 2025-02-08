
const FeaturedAgent = () => {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-fadeIn">
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary mb-4">
              Featured Agent
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Meet Your New AI Assistant
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the next generation of AI assistance with our featured agent.
              Boost your productivity and creativity like never before.
            </p>
            <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Try Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAgent;
