import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Rutgers Chess Club',
  description: 'Learn about the Rutgers University Chess Club, our mission, and our community.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            About Rutgers Chess Club
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-3xl">
            Building a vibrant chess community at Rutgers University since our founding. We bring
            together players of all skill levels for competition, learning, and fun.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Mission */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Our Mission</h2>
                    <p className="text-gray-700 leading-relaxed">
                      The Rutgers Chess Club is dedicated to promoting the game of chess among students at
                      Rutgers University. We provide a welcoming environment for players of all skill levels,
                      from complete beginners to experienced tournament players. Our mission is to foster
                      critical thinking, strategic planning, and friendly competition through the ancient and
                      noble game of chess.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Our Vision</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We envision Rutgers Chess Club as the premier chess organization in New Jersey collegiate
                      chess. We aim to create lasting connections between students through chess, host
                      competitive tournaments that attract players from across the region, and develop the next
                      generation of chess enthusiasts and champions. Through our programs, we strive to make
                      chess accessible, enjoyable, and enriching for all members of the Rutgers community.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Our Community</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Our club brings together a diverse community of chess enthusiasts from all corners of
                      Rutgers University. Whether you're a complete beginner curious about chess or a
                      seasoned tournament player seeking strong competition, you'll find a welcoming home
                      here. We host weekly meetings, organize tournaments throughout the semester, provide
                      coaching and lessons, and foster friendships that extend beyond the chessboard. Join us
                      to be part of a community that celebrates strategic thinking, friendly competition, and
                      the timeless appeal of chess.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-serif text-3xl font-bold mb-4">Ready to Join Us?</h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Become part of the Rutgers Chess Club community and take your game to the next level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/events/upcoming">
                <Button size="lg" variant="secondary" className="gap-2">
                  View Upcoming Events
                </Button>
              </Link>
              <Link href="/membership">
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/30 hover:bg-white/20">
                  Learn About Membership
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
