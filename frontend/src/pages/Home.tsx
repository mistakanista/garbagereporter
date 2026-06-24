import { Link } from "react-router-dom";
import HanauLayout from "@/components/HanauLayout";
import { BIN_DB } from "@/lib/reports";

export default function Home() {
  const bins = Object.entries(BIN_DB);
  return (
    <HanauLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Mülleimer-Melder Hanau</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Scannen Sie den QR-Code auf einem Mülleimer in Hanau, um diesen schnell
          und unkompliziert als voll oder beschädigt zu melden. Für diesen Prototyp
          können Sie unten einen Beispiel-Mülleimer auswählen.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Link
            to="/meldungen"
            className="border border-border bg-card rounded p-5 hover:border-primary transition-colors"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Verwaltung
            </div>
            <div className="font-bold text-lg">Meldungen verwalten</div>
            <div className="text-sm text-muted-foreground mt-1">
              Übersicht, filtern, sortieren und Status setzen.
            </div>
          </Link>
          <Link
            to="/karte"
            className="border border-border bg-card rounded p-5 hover:border-primary transition-colors"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Karte
            </div>
            <div className="font-bold text-lg">Standorte auf der Karte</div>
            <div className="text-sm text-muted-foreground mt-1">
              Alle offenen Meldungen in Hanau auf einen Blick.
            </div>
          </Link>
          <Link
            to="/melden/1042"
            className="border border-border bg-card rounded p-5 hover:border-primary transition-colors"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Demo
            </div>
            <div className="font-bold text-lg">QR-Code simulieren</div>
            <div className="text-sm text-muted-foreground mt-1">
              Direkt zur Meldung für Mülleimer #1042.
            </div>
          </Link>
        </div>

        <div className="border border-border rounded bg-card">
          <div className="px-5 py-3 border-b border-border bg-secondary font-semibold">
            Beispiel-Mülleimer (statt QR-Scan)
          </div>
          <ul className="divide-y divide-border">
            {bins.map(([id, b]) => (
              <li key={id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">Mülleimer #{id}</div>
                  <div className="text-sm text-muted-foreground">
                    {b.location} · {b.district}
                  </div>
                </div>
                <Link
                  to={`/melden/${id}`}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-primary/90"
                >
                  Melden →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </HanauLayout>
  );
}
