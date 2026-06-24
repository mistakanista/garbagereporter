import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="hero-gradient py-16">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-12 text-primary-foreground">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="text-primary" size={28} />
              <span className="text-xl font-bold">AI Code Camp Frankfurt</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              The hands-on AI &amp; ML unconference in Frankfurt am Main.
              By developers, for developers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <a href="#register" className="block text-primary-foreground/70 hover:text-primary transition-colors">
                Register
              </a>
              <a href="#sponsors" className="block text-primary-foreground/70 hover:text-primary transition-colors">
                Sponsors
              </a>
              <a href="#topics" className="block text-primary-foreground/70 hover:text-primary transition-colors">
                Topics
              </a>
              <a href="#schedule" className="block text-primary-foreground/70 hover:text-primary transition-colors">
                Schedule
              </a>
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4 mb-4">
              <a 
                href="https://twitter.com/javabarcamp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://github.com/javabarcamp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://linkedin.com/company/javabarcamp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="mailto:info@javabarcamp-frankfurt.de"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
            <p className="text-sm text-primary-foreground/70">
              info@javabarcamp-frankfurt.de
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} AI Code Camp Frankfurt. Made with 🤖 and ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};
