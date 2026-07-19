// Shared report store backed by localStorage.

export type ReportStatus = "new" | "neu" | "bestaetigt" | "confirmed" | "geplant" | "erledigt" | "irrelevant" | "obsolete";
export type IssueType = "voll" | "beschaedigt" | "illegal" | "beschmiert";

export interface BinInfo {
  location: string;
  district: string;
  type: string;
  lat: number;
  lng: number;
}

// Bins around Hanau, Hessen
export const BIN_DB: Record<string, BinInfo> = {
  "1042": {
    location: "Marktplatz, vor dem Rathaus",
    district: "Hanau Innenstadt",
    type: "Straßenpapierkorb 80L",
    lat: 50.1336,
    lng: 8.9166,
  },
  "2087": {
    location: "Hauptbahnhof, Vorplatz",
    district: "Bahnhofsviertel",
    type: "Bahnhofs-Sammelbehälter",
    lat: 50.1218,
    lng: 8.9293,
  },
  "3311": {
    location: "Freiheitsplatz / Forum",
    district: "Hanau Innenstadt",
    type: "Straßenpapierkorb 120L",
    lat: 50.1352,
    lng: 8.9198,
  },
  "4520": {
    location: "Schlossgarten Philippsruhe",
    district: "Kesselstadt",
    type: "Parkpapierkorb",
    lat: 50.1289,
    lng: 8.8806,
  },
  "5180": {
    location: "Wilhelmsbader Allee, Kurpark",
    district: "Wilhelmsbad",
    type: "Parkpapierkorb",
    lat: 50.1495,
    lng: 8.8728,
  },
  "6004": {
    location: "Mainufer, Steinheimer Brücke",
    district: "Steinheim",
    type: "Straßenpapierkorb 80L",
    lat: 50.1158,
    lng: 8.9259,
  },
};

export interface Report {
  id: string;
  binId: string;
  issue: IssueType;
  comment: string;
  photoDataUrl?: string;
  createdAt: number;
  status: ReportStatus;
}

const KEY = "muellmelder.reports.v1";

function read(): Report[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as Report[];
  } catch {
    return [];
  }
}

function write(reports: Report[]) {
  localStorage.setItem(KEY, JSON.stringify(reports));
  window.dispatchEvent(new CustomEvent("reports:changed"));
}

function seed(): Report[] {
  const now = Date.now();
  const sample: Report[] = [
    {
      id: "r-1",
      binId: "1042",
      issue: "voll",
      comment: "Überquillt seit dem Wochenmarkt.",
      createdAt: now - 1000 * 60 * 60 * 2,
      status: "neu",
    },
    {
      id: "r-2",
      binId: "4520",
      issue: "beschaedigt",
      comment: "Deckel abgerissen, Klappe fehlt.",
      createdAt: now - 1000 * 60 * 60 * 26,
      status: "bestaetigt",
    },
    {
      id: "r-3",
      binId: "2087",
      issue: "voll",
      comment: "",
      createdAt: now - 1000 * 60 * 60 * 50,
      status: "geplant",
    },
    {
      id: "r-4",
      binId: "5180",
      issue: "beschaedigt",
      comment: "Vandalismus, Graffiti.",
      createdAt: now - 1000 * 60 * 60 * 80,
      status: "neu",
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(sample));
  return sample;
}

export const reportsStore = {
  list(): Report[] {
    return read().sort((a, b) => b.createdAt - a.createdAt);
  },
  add(r: Omit<Report, "id" | "createdAt" | "status">): Report {
    const newR: Report = {
      ...r,
      id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      status: "neu",
    };
    const all = read();
    all.push(newR);
    write(all);
    return newR;
  },
  setStatus(id: string, status: ReportStatus) {
    const all = read().map((r) => (r.id === id ? { ...r, status } : r));
    write(all);
  },
  subscribe(cb: () => void): () => void {
    const handler = () => cb();
    window.addEventListener("reports:changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("reports:changed", handler);
      window.removeEventListener("storage", handler);
    };
  },
};

export const STATUS_LABEL: Record<ReportStatus, string> = {
  new: "Neu",
  neu: "Neu",
  bestaetigt: "Bestätigt",
  confirmed: "Bestätigt",
  geplant: "Geplant",
  erledigt: "Erledigt",
  irrelevant: "Irrelevant",
  obsolete: "Irrelevant",
};

export const ISSUE_LABEL: Record<IssueType, string> = {
  voll: "Voll / überfüllt",
  beschaedigt: "Beschädigt",
  illegal: "Illegale Ablagerungen",
  beschmiert: "Beschmiert / Graffitti",
};
