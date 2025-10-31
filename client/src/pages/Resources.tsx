import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Puzzle, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const Resources = () => {
  const resources = [
    {
      icon: Video,
      title: "Chess Rules Tutorial",
      description: "New to chess? Start here with a comprehensive video guide covering all the basic rules and piece movements.",
      link: "https://www.youtube.com/watch?v=OCSbzr-2isA",
      linkText: "Watch Tutorial",
      external: true,
    },
    {
      icon: Puzzle,
      title: "Daily Chess Puzzles",
      description: "Sharpen your tactical skills with daily puzzles on Chess.com. Practice different positions and improve your pattern recognition.",
      link: "https://www.chess.com/puzzles",
      linkText: "Solve Puzzles",
      external: true,
    },
    {
      icon: BookOpen,
      title: "Chess Strategy Resources",
      description: "Access recommended books, articles, and online resources to study chess openings, tactics, and endgame techniques at your own pace.",
      link: "/membership",
      linkText: "View Resources",
      external: false,
    },
  ];

  const externalLinks = [
    {
      name: "Chess.com",
      description: "Play online, solve puzzles, and learn with millions of players worldwide",
      url: "https://www.chess.com",
    },
    {
      name: "Lichess.org",
      description: "Free, open-source chess server with analysis tools and training features",
      url: "https://lichess.org",
    },
    {
      name: "USCF Website",
      description: "United States Chess Federation - official ratings and tournament information",
      url: "https://www.uschess.org",
    },
    {
      name: "Chess24",
      description: "Watch live tournaments, learn from grandmasters, and improve your game",
      url: "https://chess24.com",
    },
  ];

  const books = [
    {
      title: "The Complete Book of Chess Strategy",
      author: "Jeremy Silman",
      description: "Comprehensive guide to chess strategy and tactics",
    },
    {
      title: "Bobby Fischer Teaches Chess",
      author: "Bobby Fischer",
      description: "Classic instructional book focusing on tactics and combinations",
    },
    {
      title: "My System",
      author: "Aron Nimzowitsch",
      description: "Revolutionary approach to positional chess",
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="relative py-32 bg-dark-bg text-dark-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/40 to-dark-bg/20 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1200')",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-20">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Resources</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">Resources</span>
          </div>
        </div>
      </section>

      {/* Main Resources Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Learning Resources</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of resources to help you improve your chess skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {resources.map((resource, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <resource.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-4">{resource.title}</h3>
                  <p className="text-muted-foreground mb-6">{resource.description}</p>
                  {resource.external ? (
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {resource.linkText} <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  ) : (
                    <Link href={resource.link} className="block">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {resource.linkText} <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>


          {/* External Links */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">Online Chess Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {externalLinks.map((link, index) => (
                <Card key={index} className="hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-lg">{link.name}</h4>
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Visit Website →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommended Books */}
          <div>
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">Recommended Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {books.map((book, index) => (
                <Card key={index} className="bg-secondary">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-serif text-lg font-bold mb-2">{book.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">by {book.author}</p>
                    <p className="text-sm text-muted-foreground">{book.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
