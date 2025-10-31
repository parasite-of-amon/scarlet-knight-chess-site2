import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck as CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";

const Membership = () => {
  const membershipSteps = [
    {
      step: "1",
      title: "Join Officially via getINVOLVED",
      description: "Register as an official member through Rutgers getINVOLVED portal to receive updates about club activities and events.",
      link: "#",
    },
    {
      step: "2",
      title: "Join Our Discord Server",
      description: "Connect with fellow members, participate in discussions, and stay updated with real-time announcements.",
      link: "#",
    },
    {
      step: "3",
      title: "Join Our Chess.com Page",
      description: "Play online games with club members, participate in online tournaments, and practice between meetings.",
      link: "#",
    },
  ];

  const benefits = [
    "No membership fees required",
    "Access to chess equipment (boards, pieces, clocks)",
    "Weekly training sessions with experienced players",
    "Participation in USCF-rated tournaments",
    "Opportunity to compete in team events",
    "Connect with chess players of all skill levels",
    "No attendance obligation - attend when convenient",
    "Free access to all regular meetings",
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
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Membership</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">Membership</span>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6">
              Welcome to the Rutgers University Chess Club!
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Whether you are just a beginner or have a ton of experience in the game of chess,
              this club is the place for you. Stop by to play games with other Scarlet Knights
              and discuss chess-related current events.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We have in-person meetings and tournaments throughout the school year. You are
              welcome to bring your own boards, pieces, or clocks but supplies will be provided.
            </p>
          </div>

          {/* Meeting Info */}
          <Card className="max-w-4xl mx-auto mb-16 border-2 border-primary">
            <CardContent className="p-10">
              <h3 className="font-serif text-2xl font-bold mb-6 text-center">Meeting Times & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center p-6 bg-secondary rounded-lg">
                  <div className="text-4xl mb-3">📅</div>
                  <h4 className="font-bold text-xl mb-2">Tuesday Meetings</h4>
                  <p className="text-muted-foreground mb-1">7:00 PM - 9:00 PM</p>
                  <p className="text-sm text-muted-foreground">Busch Student Center - Food Court</p>
                </div>
                <div className="text-center p-6 bg-secondary rounded-lg">
                  <div className="text-4xl mb-3">📅</div>
                  <h4 className="font-bold text-xl mb-2">Friday Meetings</h4>
                  <p className="text-muted-foreground mb-1">7:00 PM - 9:00 PM</p>
                  <p className="text-sm text-muted-foreground">Busch Student Center - The Cove or Food Court</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership Steps */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">How to Join</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow these three simple steps to become an official member of the Rutgers Chess Club.
                Meetings are open to all, but these steps help us keep you updated.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {membershipSteps.map((item, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mb-6 mx-auto">
                      {item.step}
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-4 text-center">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-center mb-6">
                      {item.description}
                    </p>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Join Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">Membership Benefits</h2>
              <p className="text-muted-foreground">
                Enjoy all these benefits completely free as a member of the Rutgers Chess Club
              </p>
            </div>

            <Card>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notes */}
          <Card className="max-w-4xl mx-auto mt-12 bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="font-serif text-xl font-bold mb-4">Important Notes</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>No Fee:</strong> Membership is completely free for all Rutgers students and staff</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>No Obligation:</strong> Attend meetings whenever your schedule allows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Equipment Provided:</strong> No need to purchase your own chess set</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Respectful Environment:</strong> Treat equipment and fellow members with respect</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-medium mb-4 uppercase tracking-wider">
              FAQs
            </p>
            <h2 className="font-serif text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to commonly asked questions about our chess club, meetings, and membership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-0" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-serif text-left hover:text-primary">
                    What is the most important rule in Chess?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    The most important rule is that the king must never be left in check. When your king is threatened, you must either move it to safety, block the attack, or capture the attacking piece.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-serif text-left hover:text-primary">
                    What are the six pieces in chess called?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    The six pieces are: King, Queen, Rook, Bishop, Knight, and Pawn. Each piece has unique movement patterns and strategic values in the game.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-serif text-left hover:text-primary">
                    What are the 3 golden rules of chess?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    1) Control the center of the board, 2) Develop your pieces quickly and efficiently, 3) Protect your king through castling early in the game.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-serif text-left hover:text-primary">
                    What skill level do I need to join?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our club welcomes all skill levels, from complete beginners to experienced tournament players. We provide a supportive environment where members can play casual games, participate in tournaments, and learn from each other.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-serif text-left hover:text-primary">
                    How often does the club meet?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We meet twice weekly throughout the academic year - Tuesdays and Fridays from 7-9 PM at the Busch Student Center. There's no attendance requirement; members can attend as frequently as they wish.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-serif text-left hover:text-primary">
                    Can you win in chess without using clockwise?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, you can win without a clock in casual games. However, in tournament play, chess clocks are standard to ensure fair time management for both players.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-serif text-left hover:text-primary">
                    How can I enter the competition?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Join our club officially via getINVOLVED, join our Discord, and join our Chess.com page. We'll announce all upcoming tournaments and competitions through these channels.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-serif text-left hover:text-primary">
                    How much does it cost to join?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Membership is completely free! There are no fees to attend meetings or participate in most events. Equipment is provided, though you're welcome to bring your own.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
