import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import HanauLayout from "@/components/HanauLayout";
import {
  BIN_DB,
  ISSUE_LABEL,
  Report,
  ReportStatus,
  STATUS_LABEL,
  reportsStore,
} from "@/lib/reports";

const STATUS_COLORS: Record<ReportStatus, string> = {
  new: "bg-[hsl(var(--info))]/15 text-[hsl(var(--info))] border-[hsl(var(--info))]/30",
  confirmed: "bg-accent text-accent-foreground border-primary/30",
  planned: "bg-[hsl(var(--warning))]/15 text-[hsl(38_90%_30%)] border-[hsl(var(--warning))]/40",
  done: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
  obsolete: "bg-muted text-muted-foreground border-border",
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

interface BinReport {
    report: {
        id: number;
        status: string;
    }
}

type SortDir = "desc" | "asc";

export default function Reports() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [issueFilter, setIssueFilter] = useState<"all" | "voll" | "beschaedigt">("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [message, setMessage] = useState<string>("");
  const [reports, setReports] = useState([]);
  const [reportsFetched, setReportsFetched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {

      const fetchBins = async () => {
        try {
          const res = await fetch(`/api/report/list`);

          const data = await res.json();
          console.log("data", data);

          setReports(data);
        } catch {
          setMessage("Network error");
        }
      };
      if (!reportsFetched) {
          fetchBins();
          setReportsFetched(true);
      }

  }, [reportsFetched], );

  const districts = useMemo(
    () => Array.from(new Set(Object.values(BIN_DB).map((b) => b.district))).sort(),
    [],
  );

  const visible = useMemo(() => {
    const filtered = reports.filter((r) => {
      // Hide erledigt + irrelevant unless explicitly filtered for
      if (statusFilter === "all" && (r.report.status === "done" || r.report.status === "obsolete")) {
        return false;
      }
      if (statusFilter !== "all" && r.report.status !== statusFilter) return false;
        console.log("iss", issueFilter)
        console.log("type", r.report)
      if (issueFilter !== "all" && r.report.type !== issueFilter) return false;
      const bin = r.trashbin;
      if (districtFilter !== "all" && bin?.district !== districtFilter) return false;
      return true;
    });
    filtered.sort((a, b) =>
      sortDir === "desc" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
    );
    return filtered;
  }, [reports, statusFilter, issueFilter, districtFilter, sortDir]);

  const setObsolete = (binReport: BinReport)=> {
      handleSubmit(binReport.report.id, "obsolete");
  }

  const setConfirmed = (binReport: BinReport)=> {
        handleSubmit(binReport.report.id, "confirmed");
  }

  const setPlanned = (binReport: BinReport)=> {
          handleSubmit(binReport.report.id, "planned");
  }

  const setDone = (binReport: BinReport)=> {
            handleSubmit(binReport.report.id, "done");
  }

  const handleSubmit = async (id: number, status: string) => {
      if (!status.trim() || !id) {
              toast({
                  title: "Fehler",
                  description: "Kein Status oder keine Id vorhanden",
                  variant: "destructive",
              });
              return;
          }

          setIsSubmitting(true);

          const response = await fetch("/api/report/update", {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  id: id,
                  status: status,
              }),
          });

          if (response.status === 400) {
              toast({
                  title: "Status Aktualisierung Fehler",
                  description: "Ein Fehler ist bei der Aktualisierung des Status der Meldung aufgetreten",
                  variant: "destructive",
              });
          } else {
              toast({
                  title: "Status aktualisiert! 🎉",
                  description: "Der Status der Meldung wurde erfolgreich aktualisiert",
              });
          }

          setIsSubmitting(false);
          setReportsFetched(false);
      };

  return (
    <HanauLayout breadcrumb="Meldungen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Meldungen</h1>
            <p className="text-muted-foreground">
              {reports.length} aktive Meldung{visible.length === 1 ? "" : "en"} · Erledigte & irrelevante werden ausgeblendet.
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
              <option value="beschmiert">Beschmiert / Grafitti</option>
              <option value="illegal">Illegale Ablagerungen</option>
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
                {visible.map((item) => (
                <tr key={item.report.id} className="hover:bg-muted/40 align-top">
                    <td className="px-4 py-3 w-1/6">
                    {item.report.image ? (
                      <a href={`http://localhost:8010/reports/${item.report.image}`} target="_blank" rel="noreferrer">
                        <img
                          src={`http://localhost:8010/reports/${item.report.image}`}
                          alt={item.trashbin.location ?? "Foto"}
                          className="object-cover rounded border border-border"
                        />
                      </a>
                    ) : (
                      <div className="h-20 rounded border border-dashed border-border bg-muted/40 flex items-center justify-center text-[10px] text-muted-foreground text-center px-1">
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
                      <ActionBtn
                        onClick={() => setConfirmed(item)}
                        label="Bestätigen"
                      />
                      <ActionBtn onClick={() => setPlanned(item)} label="Planen" />
                      <ActionBtn
                        onClick={() => setDone(item)}
                        label="Erledigt"
                        variant="success"
                      />

                      <ActionBtn
                          onClick={() => setObsolete(item)}
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
