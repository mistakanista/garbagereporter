import { Link, NavLink } from "react-router-dom";
import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
    const [isScrolled, setIsScrolled] = useState(false);
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;
  const navItems = [
    { to: "/", label: t('home') },
    { to: "/meldungen", label: t('reports') },
    { to: "/karte", label: t('map') },
  ];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-secondary border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-script text-4xl text-primary leading-none">Hanau</span>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground hidden sm:inline">
              {t("brothersGrimm")}
            </span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium transition-colors ${
                                    isScrolled
                                      ? "text-muted-foreground hover:text-foreground"
                                      : "text-primary-foreground/70 hover:text-foreground"
                                  }`}
              >
                {currentLang.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => i18n.changeLanguage("de")}>
                🇩🇪 Deutsch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="bg-muted border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t("home")}</Link>
          {" › "}{t("citizenServices")}{" › "}{t("cleanness")}
          {breadcrumb ? <> › {breadcrumb}</> : null}
        </div>
      </div>

      <main className="flex-1">{children}</main>

      <footer className="bg-secondary border-t border-border mt-12 py-6 text-center text-xs text-muted-foreground">
        © {t("hanau")} ·{" "}
        <a href="#" className="hover:text-primary">{t("imprint")}</a> ·{" "}
        <a href="#" className="hover:text-primary">{t("dataProtection")}</a>
      </footer>
    </div>
  );
}
