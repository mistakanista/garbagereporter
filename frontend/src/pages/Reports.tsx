import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HanauLayout from "@/components/HanauLayout";
import {
  BIN_DB,
  ISSUE_LABEL,
  Report,
  ReportStatus,
  STATUS_LABEL,
  reportsStore,
} from "@/lib/reports";
import { toast } from "sonner";

const STATUS_COLORS: Record<ReportStatus, string> = {
  new: "bg-[hsl(var(--info))]/15 text-[hsl(var(--info))] border-[hsl(var(--info))]/30",
  neu: "bg-[hsl(var(--info))]/15 text-[hsl(var(--info))] border-[hsl(var(--info))]/30",
  bestaetigt: "bg-accent text-accent-foreground border-primary/30",
  geplant: "bg-[hsl(var(--warning))]/15 text-[hsl(38_90%_30%)] border-[hsl(var(--warning))]/40",
  erledigt: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
  irrelevant: "bg-muted text-muted-foreground border-border",
};

function fmtDate(ts: number) {
  return new Date(ts).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SortDir = "desc" | "asc";

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(() => reportsStore.list());
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [issueFilter, setIssueFilter] = useState<"all" | "voll" | "beschaedigt">("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [message, setMessage] = useState<string>("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [reports1, setReports1] = useState([]);
    const [reportsFetched, setReportsFetched] = useState(false);
    useEffect(() => {

      const fetchBins = async () => {
        try {
          const res = await fetch(`/api/report/list`);

          const data = await res.json();
          console.log("data", data);

          setReports1(data);
        } catch {
          setMessage("Network error");
        }
      };
      if (!reportsFetched) {
          fetchBins();
          setReportsFetched(true);
      }

    }, [reportsFetched], );

  useEffect(() => {
    const unsub = reportsStore.subscribe(() => setReports(reportsStore.list()));
    return unsub;
  }, []);

  const districts = useMemo(
    () => Array.from(new Set(Object.values(BIN_DB).map((b) => b.district))).sort(),
    [],
  );

  const visible = useMemo(() => {
    const filtered = reports.filter((r) => {
      // Hide erledigt + irrelevant unless explicitly filtered for
      if (statusFilter === "all" && (r.status === "erledigt" || r.status === "irrelevant")) {
        return false;
      }
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (issueFilter !== "all" && r.issue !== issueFilter) return false;
      const bin = BIN_DB[r.binId];
      if (districtFilter !== "all" && bin?.district !== districtFilter) return false;
      return true;
    });
    filtered.sort((a, b) =>
      sortDir === "desc" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
    );
    return filtered;
  }, [reports, statusFilter, issueFilter, districtFilter, sortDir]);

  const setStatus = (r: Report, s: ReportStatus) => {
    reportsStore.setStatus(r.id, s);
    toast.success(`Meldung als "${STATUS_LABEL[s]}" markiert.`);
  };

  return (
    <HanauLayout breadcrumb="Meldungen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Meldungen</h1>
            <p className="text-muted-foreground">
              {visible.length} aktive Meldung{visible.length === 1 ? "" : "en"} · Erledigte & irrelevante werden ausgeblendet.
            </p>
          </div>
          <Link
            to="/karte"
            className="px-4 py-2 border border-input rounded text-sm font-semibold hover:bg-muted"
          >
            Auf Karte anzeigen →
          </Link>
        </div>

        {/* Filters */}
        <div className="border border-border rounded bg-card p-4 mb-6 grid sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "all")}
              className="w-full h-10 px-2 border border-input rounded bg-background"
            >
              <option value="all">Alle aktiven</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase">
              Art
            </label>
            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value as typeof issueFilter)}
              className="w-full h-10 px-2 border border-input rounded bg-background"
            >
              <option value="all">Alle</option>
              <option value="voll">Voll / überfüllt</option>
              <option value="beschaedigt">Beschädigt</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase">
              Stadtteil
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full h-10 px-2 border border-input rounded bg-background"
            >
              <option value="all">Alle</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase">
              Sortierung
            </label>
            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as SortDir)}
              className="w-full h-10 px-2 border border-input rounded bg-background"
            >
              <option value="desc">Neueste zuerst</option>
              <option value="asc">Älteste zuerst</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Foto</th>
                  <th className="px-4 py-3 font-semibold">Eimer</th>
                  <th className="px-4 py-3 font-semibold">Standort</th>
                  <th className="px-4 py-3 font-semibold">Art</th>
                  <th className="px-4 py-3 font-semibold">
                    <button
                      onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                      className="font-semibold hover:text-primary"
                    >
                      Zeitpunkt {sortDir === "desc" ? "↓" : "↑"}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      Keine Meldungen mit diesen Filtern.
                    </td>
                  </tr>
                )}
                {reports1.map((item) => (
                <tr key={item.report.id} className="hover:bg-muted/40 align-top">
                  <td className="px-4 py-3">
                    {item.report.image ? (
                      <a href={`http://localhost:8010/reports/${item.report.image}`} target="_blank" rel="noreferrer">
                        <img
                          src={`http://localhost:8010/reports/${item.report.image}`}
                          alt={item.trashbin.location ?? "Foto"}
                          className="w-16 h-16 object-cover rounded border border-border"
                        />
                      </a>
                    ) : (
                      <div className="w-16 h-16 rounded border border-dashed border-border bg-muted/40 flex items-center justify-center text-[10px] text-muted-foreground text-center px-1">
                        Kein Foto
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">#{item.report.trashbinId}</td>
                  <td className="px-4 py-3">
                    <div>{item.trashbin.location ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{item.trashbin.district}</div>
                    <div className="text-xs text-muted-foreground">{item.trashbin.street} {item.trashbin.houseNumber}</div>
                    <div className="text-xs text-muted-foreground">{item.trashbin.zip} {item.trashbin.city}</div>
                  </td>

                  <td className="px-4 py-3">
                    {ISSUE_LABEL[item.report.type]}
                    {item.report.description && (
                      <div className="text-xs italic text-muted-foreground mt-1 max-w-xs">
                        „{item.report.description}"
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {fmtDate(item.report.created)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${STATUS_COLORS[item.report.status]}`}
                    >
                      {STATUS_LABEL[item.report.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 justify-end">
                      <ActionBtn onClick={() => setStatus(item, "bestaetigt")} label="Bestätigen" />
                      <ActionBtn onClick={() => setStatus(item, "geplant")} label="Planen" />
                      <ActionBtn
                        onClick={() => setStatus(item, "erledigt")}
                        label="Erledigt"
                        variant="success"
                      />
                      <ActionBtn
                        onClick={() => setStatus(item, "irrelevant")}
                        label="Irrelevant"
                        variant="muted"
                      />
                      <Link
                        to={`/karte?report=${item.report.id}`}
                        className="px-2 py-1 text-xs rounded border border-input hover:bg-muted"
                      >
                        Karte
                      </Link>
                    </div>
                  </td>
                </tr>
                ))}

                {visible.map((r) => {
                  const bin = BIN_DB[r.binId];
                  return (
                    <tr key={r.id} className="hover:bg-muted/40 align-top">
                      <td className="px-4 py-3">
                        {r.photoDataUrl ? (
                          <a href={r.photoDataUrl} target="_blank" rel="noreferrer">
                            <img
                              src={r.photoDataUrl}
                              alt="Foto"
                              className="w-16 h-16 object-cover rounded border border-border"
                            />
                          </a>
                        ) : (
                          <div className="w-16 h-16 rounded border border-dashed border-border bg-muted/40 flex items-center justify-center text-[10px] text-muted-foreground text-center px-1">
                            Kein Foto
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">#{r.binId}</td>
                      <td className="px-4 py-3">
                        <div>{bin?.location ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{bin?.district}</div>
                        {r.comment && (
                          <div className="text-xs italic text-muted-foreground mt-1 max-w-xs">
                            „{r.comment}"
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{ISSUE_LABEL[r.issue]}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {fmtDate(r.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${STATUS_COLORS[r.status]}`}
                        >
                          {STATUS_LABEL[r.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 justify-end">
                          <ActionBtn onClick={() => setStatus(r, "bestaetigt")} label="Bestätigen" />
                          <ActionBtn onClick={() => setStatus(r, "geplant")} label="Planen" />
                          <ActionBtn
                            onClick={() => setStatus(r, "erledigt")}
                            label="Erledigt"
                            variant="success"
                          />
                          <ActionBtn
                            onClick={() => setStatus(r, "irrelevant")}
                            label="Irrelevant"
                            variant="muted"
                          />
                          <Link
                            to={`/karte?report=${r.id}`}
                            className="px-2 py-1 text-xs rounded border border-input hover:bg-muted"
                          >
                            Karte
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HanauLayout>
  );
}

function ActionBtn({
  onClick,
  label,
  variant = "default",
}: {
  onClick: () => void;
  label: string;
  variant?: "default" | "success" | "muted";
}) {
  const cls =
    variant === "success"
      ? "bg-[hsl(var(--success))] text-white hover:opacity-90"
      : variant === "muted"
        ? "border border-input hover:bg-muted"
        : "bg-primary text-primary-foreground hover:bg-primary/90";
  return (
    <button onClick={onClick} className={`px-2 py-1 text-xs rounded font-semibold ${cls}`}>
      {label}
    </button>
  );
}
