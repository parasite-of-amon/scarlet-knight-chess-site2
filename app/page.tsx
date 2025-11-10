import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Trophy, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1600')] bg-cover bg-center opacity-40" />

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-primary drop-shadow-lg">Rutgers University Chess Club</span>
            </h1>
            <p className="text-xl mb-8 leading-relaxed font-medium text-contrast">
              Join us every Tuesday and Friday, 7-9 PM at Busch Student Center.
              <br />
              All skill levels welcome!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/membership">
                <Button className="bg-primary hover:bg-primary/90 text-lg px-10 py-7 font-bold shadow-xl hover:scale-105 transition-all duration-300">
                  Join Club
                </Button>
              </Link>
              <Link href="/events/upcoming">
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-7 font-bold shadow-xl hover:scale-105 transition-all duration-300">
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-32 relative z-30">
            <Card className="event-card hover-lift">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2 text-gray-900">Weekly Meetings</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join us every Tuesday and Friday for casual games and tournaments
                </p>
                <Link href="/events/upcoming" className="text-primary text-sm font-medium hover:underline">
                  Learn More →
                </Link>
              </CardContent>
            </Card>

            <Card className="event-card hover-lift bg-primary text-primary-foreground border-primary">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">All Welcome</h3>
                <p className="text-primary-foreground/90 text-sm mb-4">
                  Open to all Rutgers students and staff, no experience required
                </p>
                <Link href="/membership" className="text-primary-foreground text-sm font-medium hover:underline">
                  Learn More →
                </Link>
              </CardContent>
            </Card>

            <Card className="event-card hover-lift">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2 text-gray-900">Tournaments</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Compete in USCF-rated tournaments and improve your skills
                </p>
                <Link href="/events/past" className="text-primary text-sm font-medium hover:underline">
                  Learn More →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1600')] bg-cover bg-center opacity-30" />

        <div className="container mx-auto px-4 text-center relative z-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-contrast">
            Join Our Club This Year
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-contrast">
            We hold our meetings in Busch Student Center food court every Tuesday and Friday 7-9 PM!
            No fees, no attendance obligation, equipment provided.
          </p>
          <Link href="/membership">
            <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 font-bold shadow-xl hover:scale-105 transition-all">
              JOIN NOW
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
