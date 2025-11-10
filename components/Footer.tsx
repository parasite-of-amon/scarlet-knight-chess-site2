'use client';

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-primary text-3xl">♞</div>
              <span className="font-serif text-xl font-bold">RUTGERS CHESS</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Building chess excellence at Rutgers University for over a century.
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <Mail size={16} className="text-primary" />
              <a href="mailto:e-board@rutgerschessclub.org" className="text-sm hover:text-primary">
                e-board@rutgerschessclub.org
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events/upcoming" className="text-sm hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-sm hover:text-primary transition-colors">
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-sm hover:text-primary transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="https://chess.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                  Chess.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your Email Address"
                className="bg-[#2a2a2a] border-gray-600 text-gray-100 placeholder:text-gray-400"
              />
              <Button className="bg-primary text-dark-bg hover:bg-primary/90 px-3">
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p className="text-sm text-gray-300 mb-4 md:mb-0">
              Copyright © 2025. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-primary text-dark-bg flex items-center justify-center rounded hover:bg-primary/90 transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-primary text-dark-bg flex items-center justify-center rounded hover:bg-primary/90 transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-primary text-dark-bg flex items-center justify-center rounded hover:bg-primary/90 transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-primary text-dark-bg flex items-center justify-center rounded hover:bg-primary/90 transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link href="/login" className="text-xs text-gray-400 hover:text-primary transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
