import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HanauLayout from "@/components/HanauLayout";
import { BIN_DB, ISSUE_LABEL, Report, STATUS_LABEL, reportsStore } from "@/lib/reports";

// Fix leaflet default marker icon paths (bundler can't resolve them automatically).
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const HANAU_CENTER: [number, number] = [50.1336, 8.9166];

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>(() => reportsStore.list());
  const [params] = useSearchParams();
  const focusId = params.get("report");

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    const unsub = reportsStore.subscribe(() => setReports(reportsStore.list()));
    return unsub;
  }, []);

  // init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView(HANAU_CENTER, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap-Mitwirkende",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
  }, []);

  // sync markers with reports
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // remove old
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const active = reports.filter(
      (r) => r.status !== "erledigt" && r.status !== "irrelevant",
    );

    active.forEach((r) => {
      const bin = BIN_DB[r.binId];
      if (!bin) return;
      const m = L.marker([bin.lat, bin.lng]).addTo(map);
      m.bindPopup(
        `<div style="font-family:system-ui;font-size:13px;min-width:180px">
          <strong>Mülleimer #${r.binId}</strong><br/>
          ${escapeHtml(bin.location)}<br/>
          <em>${escapeHtml(bin.district)}</em><br/>
          <hr style="margin:6px 0;border:0;border-top:1px solid #ddd"/>
          ${ISSUE_LABEL[r.issue]} · ${STATUS_LABEL[r.status]}<br/>
          <span style="color:#666">${new Date(r.createdAt).toLocaleString("de-DE")}</span>
          ${r.photoDataUrl ? `<br/><img src="${r.photoDataUrl}" style="margin-top:6px;max-width:160px;border-radius:4px"/>` : ""}
          ${r.comment ? `<br/><span style="font-style:italic">„${escapeHtml(r.comment)}"</span>` : ""}
        </div>`,
      );
      markersRef.current[r.id] = m;
    });

    // focus
    if (focusId && markersRef.current[focusId]) {
      const r = active.find((x) => x.id === focusId);
      if (r) {
        const bin = BIN_DB[r.binId];
        if (bin) {
          map.setView([bin.lat, bin.lng], 16, { animate: true });
          markersRef.current[focusId].openPopup();
        }
      }
    }
  }, [reports, focusId]);

  const active = reports.filter(
    (r) => r.status !== "erledigt" && r.status !== "irrelevant",
  );

  return (
    <HanauLayout breadcrumb="Karte">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Karte der Meldungen</h1>
            <p className="text-muted-foreground">
              {active.length} aktive Meldung{active.length === 1 ? "" : "en"} in Hanau.
            </p>
          </div>
          <Link
            to="/meldungen"
            className="px-4 py-2 border border-input rounded text-sm font-semibold hover:bg-muted"
          >
            Zur Tabelle →
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-4">
          <div
            ref={containerRef}
            className="h-[600px] rounded border border-border bg-muted"
          />
          <aside className="border border-border rounded bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary font-semibold text-sm">
              Aktive Meldungen
            </div>
            <ul className="divide-y divide-border max-h-[560px] overflow-y-auto">
              {active.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground text-center">
                  Keine aktiven Meldungen.
                </li>
              )}
              {active.map((r) => {
                const bin = BIN_DB[r.binId];
                return (
                  <li key={r.id}>
                    <Link
                      to={`/karte?report=${r.id}`}
                      className={`block px-4 py-3 text-sm hover:bg-muted ${
                        focusId === r.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="font-semibold">#{r.binId} · {ISSUE_LABEL[r.issue]}</div>
                      <div className="text-xs text-muted-foreground">{bin?.location}</div>
                      <div className="text-xs text-muted-foreground">
                        {STATUS_LABEL[r.status]} · {new Date(r.createdAt).toLocaleDateString("de-DE")}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </HanauLayout>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
