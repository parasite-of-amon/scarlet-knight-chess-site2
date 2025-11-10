import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Calendar, Trophy, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Membership | Rutgers Chess Club',
  description: 'Join the Rutgers Chess Club and enjoy exclusive benefits, tournaments, and community events.',
};

export default function MembershipPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Become a Member
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Join the Rutgers Chess Club and become part of a vibrant community of chess enthusiasts.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Membership Benefits</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Weekly Meetings</h3>
                <p className="text-gray-700">
                  Attend our regular Tuesday evening meetings featuring casual games, practice sessions,
                  and social activities with fellow chess enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Tournament Access</h3>
                <p className="text-gray-700">
                  Participate in club tournaments including blitz, rapid, and classical time controls.
                  Compete for prizes and rating points.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Coaching & Lessons</h3>
                <p className="text-gray-700">
                  Access to coaching from experienced players, beginner workshops, and resources to
                  improve your game at any skill level.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Exclusive Community</h3>
                <p className="text-gray-700">
                  Join our Discord server, connect with members, arrange games, discuss strategies,
                  and be part of the Rutgers chess community.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How to Join */}
          <Card className="bg-white">
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl font-bold mb-6 text-center">How to Join</h2>
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Attend a Meeting</h3>
                    <p className="text-gray-700">
                      Come to one of our Tuesday evening meetings at the Rutgers Student Center.
                      No prior signup required!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sign Up</h3>
                    <p className="text-gray-700">
                      Fill out our membership form and pay the semester dues. Membership is open to all
                      Rutgers students.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Join Discord</h3>
                    <p className="text-gray-700">
                      Get the Discord server link to stay connected with the community, find practice
                      partners, and get event updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Start Playing!</h3>
                    <p className="text-gray-700">
                      Participate in tournaments, attend workshops, and enjoy everything the club has to offer.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <div className="mt-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-serif text-3xl font-bold mb-4">Membership Pricing</h2>
            <div className="text-5xl font-bold mb-2">$15</div>
            <p className="text-lg text-white/90 mb-6">per semester</p>
            <ul className="text-left max-w-md mx-auto space-y-2 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>Access to all club meetings and events</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>Tournament entry discounts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>Coaching and training resources</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>Discord community access</span>
              </li>
            </ul>
            <Link href="/events/upcoming">
              <Button size="lg" variant="secondary">
                View Upcoming Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
