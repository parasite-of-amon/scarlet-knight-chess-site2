import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Globe, Trophy, Brain, Gamepad2 } from 'lucide-react';

export const metadata = {
  title: 'Chess Resources | Rutgers Chess Club',
  description: 'Helpful resources for improving your chess game, including websites, books, and tools.',
};

export default function ResourcesPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Chess Resources
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Helpful tools, websites, and materials to improve your chess game at any level.
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-serif text-3xl font-bold mb-8">Online Platforms</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold mb-2">Chess.com</h3>
                    <p className="text-gray-700 mb-3">
                      Play online, solve puzzles, watch lessons, and analyze your games. Free and premium
                      accounts available.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://chess.com" target="_blank" rel="noopener noreferrer">
                        Visit Chess.com
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold mb-2">Lichess.org</h3>
                    <p className="text-gray-700 mb-3">
                      Completely free, open-source chess platform. Play, study, and analyze games without
                      ads or paywalls.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://lichess.org" target="_blank" rel="noopener noreferrer">
                        Visit Lichess
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="font-serif text-3xl font-bold mb-8">Learning Resources</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold mb-2">YouTube Channels</h3>
                    <p className="text-gray-700 mb-3">
                      Recommended channels: GothamChess, Levy Rozman, agadmator, ChessNetwork, and the
                      Saint Louis Chess Club.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://youtube.com/@GothamChess" target="_blank" rel="noopener noreferrer">
                        Watch GothamChess
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold mb-2">Recommended Books</h3>
                    <p className="text-gray-700 mb-3">
                      "Bobby Fischer Teaches Chess", "The Amateur's Mind" by Silman, "How to Reassess
                      Your Chess" by Silman.
                    </p>
                    <p className="text-sm text-gray-600">
                      Visit your local library or bookstore
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold mb-2">Tactics Training</h3>
                    <p className="text-gray-700 mb-3">
                      Solve tactical puzzles daily on Chess.com, Lichess, or ChessTempo to sharpen your
                      pattern recognition.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://lichess.org/training" target="_blank" rel="noopener noreferrer">
                        Practice Tactics
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold mb-2">US Chess Federation</h3>
                    <p className="text-gray-700 mb-3">
                      Get your official USCF rating, find tournaments, and access member benefits.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://new.uschess.org" target="_blank" rel="noopener noreferrer">
                        Visit USCF
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Study Tips */}
          <Card className="bg-white">
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">Study Tips for Improvement</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Solve Tactical Puzzles Daily</h3>
                    <p className="text-gray-700">
                      Spend 15-20 minutes each day solving tactical puzzles. This is the fastest way to
                      improve pattern recognition and calculation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Analyze Your Games</h3>
                    <p className="text-gray-700">
                      After each game, spend time reviewing your moves. Use computer analysis to find
                      mistakes and understand better alternatives.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Study Opening Principles</h3>
                    <p className="text-gray-700">
                      Don't memorize long opening lines. Focus on understanding principles: control the
                      center, develop pieces, castle early.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Play Longer Time Controls</h3>
                    <p className="text-gray-700">
                      While blitz is fun, playing longer games (15+10 or 30+0) helps you practice
                      calculating and planning more deeply.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Join Club Events</h3>
                    <p className="text-gray-700">
                      Attend our weekly meetings and tournaments. Playing over-the-board and discussing
                      games with others accelerates improvement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="font-serif text-3xl font-bold mb-4">Ready to Improve?</h2>
            <p className="text-lg text-white/90 mb-6">
              Join us at our next meeting to practice with experienced players!
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
