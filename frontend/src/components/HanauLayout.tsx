import { Link, NavLink } from "react-router-dom";
import { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Startseite" },
  { to: "/meldungen", label: "Meldungen" },
  { to: "/karte", label: "Karte" },
];
const host = "http://localhost:8000/"

export default function HanauLayout({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb?: string;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-secondary border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-baseline gap-2">
            <img
                  src={host + "hanauLogo.jpg"}
                  alt="Hanau Logo"
                  title="Hanau - Brüder Grimm Stadt"
                  className="h-16 object-contain"
                />
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <div className="bg-muted border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Startseite</Link>
          {" › "}Bürgerservice › Sauberkeit
          {breadcrumb ? <> › {breadcrumb}</> : null}
        </div>
      </div>

      <main className="flex-1">{children}</main>

      <footer className="bg-secondary border-t border-border mt-12 py-6 text-center text-xs text-muted-foreground">
        © Stadt Hanau – Prototyp Mülleimer-Melder ·{" "}
        <a href="#" className="hover:text-primary">Impressum</a> ·{" "}
        <a href="#" className="hover:text-primary">Datenschutz</a>
      </footer>
    </div>
  );
}
