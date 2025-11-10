import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Mail, Trophy, Users } from 'lucide-react';

export const metadata = {
  title: 'Sponsors | Rutgers Chess Club',
  description: 'Support the Rutgers Chess Club and help us grow the chess community at Rutgers University.',
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Our Sponsors & Partners
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Thank you to our sponsors who make our tournaments, events, and programs possible.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Become a Sponsor */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-2">Become a Sponsor</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The Rutgers Chess Club is always looking for sponsors to help support our mission of
                    promoting chess at Rutgers University. Sponsorships help us organize tournaments,
                    provide prizes, purchase equipment, and host special events throughout the year.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsorship Benefits */}
          <h2 className="font-serif text-3xl font-bold mb-8">Sponsorship Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Tournament Naming Rights</h3>
                <p className="text-gray-700">
                  Major sponsors can have tournaments named after their organization, with recognition in
                  all promotional materials and event announcements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Community Exposure</h3>
                <p className="text-gray-700">
                  Your logo and information will be displayed at our events, on our website, and in
                  communications to our active membership base.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sponsorship Tiers */}
          <h2 className="font-serif text-3xl font-bold mb-8">Sponsorship Tiers</h2>
          <div className="space-y-6 mb-12">
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-primary mb-1">Gold Sponsor</h3>
                    <p className="text-gray-600">$500+ per semester</p>
                  </div>
                  <div className="text-3xl">🥇</div>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Tournament naming rights</li>
                  <li>• Prominent logo placement on website and materials</li>
                  <li>• Recognition at all club events</li>
                  <li>• Social media shoutouts</li>
                  <li>• Opportunity for sponsored content</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-400">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-gray-700 mb-1">Silver Sponsor</h3>
                    <p className="text-gray-600">$250-$499 per semester</p>
                  </div>
                  <div className="text-3xl">🥈</div>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Logo on website sponsors page</li>
                  <li>• Recognition at major events</li>
                  <li>• Social media mentions</li>
                  <li>• Email newsletter recognition</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-amber-700 mb-1">Bronze Sponsor</h3>
                    <p className="text-gray-600">$100-$249 per semester</p>
                  </div>
                  <div className="text-3xl">🥉</div>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Name listed on website</li>
                  <li>• Recognition at events</li>
                  <li>• Thank you in social media</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact CTA */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-gray-700 mb-6">
                    Interested in sponsoring the Rutgers Chess Club? We'd love to discuss how we can
                    work together to promote chess and support our community. Contact us to learn more
                    about sponsorship opportunities and custom packages.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <a href="mailto:chess@rutgers.edu">Email Us</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/contact">Contact Page</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thank You */}
          <div className="mt-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-serif text-3xl font-bold mb-4">Thank You</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              To all our sponsors and supporters, thank you for helping us grow the chess community at
              Rutgers University. Your generosity makes everything we do possible.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
