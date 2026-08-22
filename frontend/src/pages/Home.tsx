import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HanauLayout from "@/components/HanauLayout";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [bins, setBins] = useState([]);
  const [binsFetched, setBinsFetched] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {

    const fetchBins = async () => {
      try {
        const res = await fetch(`/api/trashbin/list`);

        const data = await res.json();
        console.log("data", data);

        setBins(data);
      } catch {
        setMessage("Network error");
      }
    };
    if (!binsFetched) {
        fetchBins();
        setBinsFetched(true);
    }

  }, [binsFetched], );
  return (
    <HanauLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("homeReporter")}</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          {t("homeIntro")}
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Link
            to="/meldungen"
            className="border border-border bg-card rounded p-5 hover:border-primary transition-colors"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {t("homeAdministration")}
            </div>
            <div className="font-bold text-lg">{t("homeAdministerReports")}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("homeOverview")}
            </div>
          </Link>
          <Link
            to="/karte"
            className="border border-border bg-card rounded p-5 hover:border-primary transition-colors"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {t("map")}
            </div>
            <div className="font-bold text-lg">{t("homeLocations")}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("homeReports")}
            </div>
          </Link>
          <Link
            to="/melden/3345"
            className="border border-border bg-card rounded p-5 hover:border-primary transition-colors"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Demo
            </div>
            <div className="font-bold text-lg">{t("homeSimulateQr")} </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("homeReportDirect")}
            </div>
          </Link>
        </div>

        <div className="border border-border rounded bg-card">
          <div className="px-5 py-3 border-b border-border bg-secondary font-semibold">
            {t("homeTrashBins")}
          </div>

          <ul className="divide-y divide-border">
            {bins.map((bin) => (
                <li key={bin.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold">{bin.type} #{bin.number}</div>
                      <div className="text-sm text-muted-foreground">
                            {bin.location} <br /> {bin.district}, {bin.street} {bin.houseNumber}, {bin.zip} {bin.city}
                      </div>
                    </div>
                    <Link
                      to={`/melden/${bin.number}`}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-primary/90"
                    >
                      {t("report")} →
                    </Link>
                  </li>
              ))}
          </ul>
        </div>
      </div>
    </HanauLayout>
  );
}
