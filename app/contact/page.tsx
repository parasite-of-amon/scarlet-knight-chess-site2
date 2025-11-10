import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Contact Us | Rutgers Chess Club',
  description: 'Get in touch with the Rutgers Chess Club. Find our meeting location and contact information.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Have questions? Want to get involved? Reach out to us!
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-700 mb-4">
                  Send us an email for general inquiries, membership questions, or tournament information.
                </p>
                <a
                  href="mailto:chess@rutgers.edu"
                  className="text-primary hover:underline font-medium"
                >
                  chess@rutgers.edu
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Discord</h3>
                <p className="text-gray-700 mb-4">
                  Join our Discord server to chat with members, find practice partners, and stay updated
                  on club events.
                </p>
                <Button variant="outline">Join Discord Server</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Meeting Location</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Rutgers Student Center</strong>
                </p>
                <p className="text-gray-700 mb-2">126 College Avenue</p>
                <p className="text-gray-700 mb-4">New Brunswick, NJ 08901</p>
                <p className="text-sm text-gray-600">
                  We meet every Tuesday at 7:00 PM in the Student Center. Check our events page for
                  the specific room number.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Executive Board</h3>
                <p className="text-gray-700 mb-4">
                  Want to get in touch with our leadership team? Email us or find us at our weekly meetings.
                </p>
                <p className="text-sm text-gray-600">
                  President, Vice President, Treasurer, and Tournament Director are available to answer
                  questions and help with any club matters.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Do I need to be a Rutgers student to join?</h3>
                  <p className="text-gray-700">
                    Membership is primarily for Rutgers students, but we welcome visitors and guests at
                    our meetings. Contact us for more information about guest policies.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What if I'm a complete beginner?</h3>
                  <p className="text-gray-700">
                    Absolutely! We welcome players of all skill levels. We offer beginner workshops and
                    have experienced members happy to teach the basics.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">How do I sign up for tournaments?</h3>
                  <p className="text-gray-700">
                    Check our events page for upcoming tournaments. Registration links and details are
                    provided for each event. Most tournaments are free for members!
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Can I just show up to a meeting?</h3>
                  <p className="text-gray-700">
                    Yes! Feel free to come to any Tuesday meeting. No prior registration required. We'd
                    love to meet you!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-serif text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-lg text-white/90 mb-6">
              Come to our next meeting or check out our upcoming events!
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href="/events/upcoming">View Upcoming Events</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
