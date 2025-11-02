import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
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

  const [currentPath] = location;
  const isActive = (path: string) => currentPath === path;
  const isEventsActive = () => eventsItems.some(item => currentPath === item.path);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-primary text-3xl">♞</div>
            <span className="text-gray-900 font-serif text-xl font-bold">
              RUTGERS CHESS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                isActive("/")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              data-testid="link-home"
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors ${
                isActive("/about")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              data-testid="link-about"
            >
              About
            </Link>

            {/* Events Dropdown */}
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
              
              {/* Dropdown Menu */}
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

            <Link
              href="/resources"
              className={`text-sm transition-colors ${
                isActive("/resources")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              data-testid="link-resources"
            >
              Resources
            </Link>
            <Link
              href="/sponsors"
              className={`text-sm transition-colors ${
                isActive("/sponsors")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              data-testid="link-sponsors"
            >
              Sponsors
            </Link>
            <Link
              href="/contact"
              className={`text-sm transition-colors ${
                isActive("/contact")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              data-testid="link-contact"
            >
              Contact
            </Link>

            <Link
              href={joinClubItem.path}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold border-2 border-[#FFD700] hover:bg-primary/90 hover:shadow-lg transition-all duration-300"
              data-testid="button-join-us"
            >
              {joinClubItem.name}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white">
            <Link
              href="/"
              className={`block py-2 text-sm transition-colors ${
                isActive("/")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              onClick={() => setIsOpen(false)}
              data-testid="mobile-link-home"
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block py-2 text-sm transition-colors ${
                isActive("/about")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              onClick={() => setIsOpen(false)}
              data-testid="mobile-link-about"
            >
              About
            </Link>

            {/* Events Submenu for Mobile */}
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

            <Link
              href="/resources"
              className={`block py-2 text-sm transition-colors ${
                isActive("/resources")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              onClick={() => setIsOpen(false)}
              data-testid="mobile-link-resources"
            >
              Resources
            </Link>
            <Link
              href="/sponsors"
              className={`block py-2 text-sm transition-colors ${
                isActive("/sponsors")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              onClick={() => setIsOpen(false)}
              data-testid="mobile-link-sponsors"
            >
              Sponsors
            </Link>
            <Link
              href="/contact"
              className={`block py-2 text-sm transition-colors ${
                isActive("/contact")
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-primary"
              }`}
              onClick={() => setIsOpen(false)}
              data-testid="mobile-link-contact"
            >
              Contact
            </Link>

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
