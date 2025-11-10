'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  const navItemsAfterEvents = [
    { name: "Resources", path: "/resources" },
    { name: "Sponsors", path: "/sponsors" },
    { name: "Contact", path: "/contact" },
  ];

  const eventsItems = [
    { name: "Past Events", path: "/events/past" },
    { name: "Upcoming Events", path: "/events/upcoming" },
    { name: "Calendar", path: "/events/calendar" },
  ];

  const joinClubItem = { name: "Join Us", path: "/membership" };

  const isActive = (path: string) => pathname === path;
  const isEventsActive = () => eventsItems.some(item => pathname === item.path);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-primary text-3xl">♞</div>
            <span className="text-gray-900 font-serif text-xl font-bold">
              RUTGERS CHESS
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm transition-colors ${
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-gray-700 hover:text-primary"
                }`}
                data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </Link>
            ))}

            <div className="relative group">
              <button
                className={`text-sm transition-colors flex items-center gap-1 ${
                  isEventsActive()
                    ? "text-primary font-medium"
                    : "text-gray-700 hover:text-primary"
                }`}
                data-testid="dropdown-events"
              >
                Events
                <ChevronDown className="h-3 w-3" />
              </button>

              <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {eventsItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                      data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navItemsAfterEvents.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm transition-colors ${
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-gray-700 hover:text-primary"
                }`}
                data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href={joinClubItem.path}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold border-2 border-[#FFD700] hover:bg-primary/90 hover:shadow-lg transition-all duration-300"
              data-testid="button-join-us"
            >
              {joinClubItem.name}
            </Link>
          </div>

          <button
            className="md:hidden text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 text-sm transition-colors ${
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-gray-700 hover:text-primary"
                }`}
                onClick={() => setIsOpen(false)}
                data-testid={`mobile-link-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </Link>
            ))}

            <div className="space-y-2">
              <div className={`py-2 text-sm font-medium ${
                isEventsActive() ? "text-primary" : "text-gray-700"
              }`}>
                Events
              </div>
              <div className="pl-4 space-y-2">
                {eventsItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`block py-2 text-sm transition-colors ${
                      isActive(item.path)
                        ? "text-primary font-medium"
                        : "text-gray-600 hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                    data-testid={`mobile-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {navItemsAfterEvents.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 text-sm transition-colors ${
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-gray-700 hover:text-primary"
                }`}
                onClick={() => setIsOpen(false)}
                data-testid={`mobile-link-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href={joinClubItem.path}
              className="block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold border-2 border-[#FFD700] hover:bg-primary/90 transition-all duration-300 text-center mt-4"
              onClick={() => setIsOpen(false)}
              data-testid="mobile-button-join-us"
            >
              {joinClubItem.name}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
