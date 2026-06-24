import { useState, useEffect } from "react";
import { Code2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#register", label: "Register" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#topics", label: "Topics" },
  { href: "#schedule", label: "Schedule" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          <a href="#" className={`flex items-center gap-2.5 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`}>
            <Code2 className="text-primary" size={24} />
            <span className="font-semibold text-base font-mono tracking-tight hidden sm:inline">
              AI Code Camp FFM
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Button
              variant={isScrolled ? "default" : "hero"}
              size="sm"
              onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
            >
              Register
            </Button>
          </div>

          <button
            className={`md:hidden p-2 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border animate-fade-in">
            <div className="section-container py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Register
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
