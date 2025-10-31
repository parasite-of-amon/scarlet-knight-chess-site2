import { useLocation } from "wouter";
import { useEffect } from "react";

const NotFound = () => {
  const [location] = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location);
  }, [location]);

  return (
    <div className="relative min-h-screen bg-dark-bg text-dark-foreground flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/95 to-dark-bg/70 z-10" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1200')",
        }}
      />
      <div className="relative z-20 text-center px-4">
        <div className="text-9xl md:text-[200px] font-serif font-bold text-primary mb-8">404</div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable
        </p>
        <a href="/" className="inline-block bg-primary text-dark-bg px-8 py-4 rounded hover:bg-primary/90 font-medium transition-colors">
          Back To Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
