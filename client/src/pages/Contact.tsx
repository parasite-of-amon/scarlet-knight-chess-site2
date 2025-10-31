import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
  };

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
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Contact Us</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">Contact Us</span>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info Card */}
            <Card className="bg-dark-bg text-dark-foreground border-none relative overflow-hidden">
              <CardContent className="p-10">
                <p className="text-primary text-sm font-medium mb-4 uppercase tracking-wider">
                  Contact Us
                </p>
                <h2 className="font-serif text-3xl font-bold mb-6">Get In Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have questions or want to join? Get in touch with us and we'll respond as soon as possible.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href="mailto:e-board@rutgerschessclub.org" className="hover:text-primary">
                      e-board@rutgerschessclub.org
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Busch Student Center, Food Court</span>
                  </div>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600"
                  alt="Chess pieces"
                  className="rounded-lg mb-6"
                />

                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded hover:bg-primary/90 transition-colors">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded hover:bg-primary/90 transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded hover:bg-primary/90 transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded hover:bg-primary/90 transition-colors">
                    <Youtube size={18} />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    required
                    className="bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    className="bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Subject"
                    required
                    className="bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Message"
                    rows={6}
                    required
                    className="bg-background resize-none"
                  />
                </div>

                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto px-8">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-muted">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.0!2d-74.4638!3d40.5237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDMxJzI1LjMiTiA3NMKwMjcnNDkuNyJX!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Rutgers University Location"
          />
      </section>
    </div>
  );
};

export default Contact;
