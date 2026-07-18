import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import HanauLayout from "@/components/HanauLayout";
import { reportsStore, IssueType } from "@/lib/reports";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export default function Report() {
  const { binId = "" } = useParams();
  const [message, setMessage] = useState<string>("");
  const [bin, setBin] = useState({
                                       number: "",
                                       type: "",
                                       location: "",
                                       street: "",
                                       houseNumber: "",
                                       district: "",
                                       zip: "",
                                       city: "",
                                       latitude: "",
                                       longitude: "",
                                     });
  const [binFetched, setBinFetched] = useState(false);
  useEffect(() => {

          const fetchBins = async () => {
            try {
              const res = await fetch(`/api/trashbin/get/${binId}`);

              const data = await res.json();
              console.log("data", data);

              setBin(data);
            } catch {
              setMessage("Network error");
            }
          };
          if (!binFetched) {
              fetchBins();
              setBinFetched(true);
          }

        }, [binFetched, binId], );

  const [issue, setIssue] = useState<IssueType | "">("");
  const [comment, setComment] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setPhotoPreview(null);
      return;
    }
    const dataUrl = await fileToDataUrl(f);
    setPhotoPreview(dataUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue) {
      toast.error("Bitte wählen Sie das Problem aus.");
      return;
    }
    if (comment.length > 500) {
      toast.error("Kommentar zu lang (max. 500 Zeichen).");
      return;
    }
    reportsStore.add({
      binId,
      issue,
      comment: comment.trim(),
      photoDataUrl: photoPreview ?? undefined,
    });
    setSubmitted(true);
    toast.success("Meldung erfolgreich übermittelt. Vielen Dank!");
  };

  return (
    <HanauLayout breadcrumb={`Mülleimer melden › #${binId}`}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Mülleimer melden</h1>
        <p className="text-muted-foreground mb-6">
          Helfen Sie mit, Hanau sauber zu halten. Ihre Meldung wird an den
          städtischen Betriebshof weitergeleitet.
        </p>

        <div className="border-l-4 border-primary bg-accent/60 p-5 mb-8 rounded-r">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Erkannter Mülleimer (per QR-Code)
          </div>
          <div className="text-xl font-bold">{bin.type} #{binId}</div>
          <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Standort</dt>
              <dd className="font-semibold">{bin.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Stadtteil</dt>
              <dd className="font-semibold">{bin.district}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Adresse</dt>
              <dd className="font-semibold">{bin.street} {bin.houseNumber}<br />{bin.zip} {bin.city}</dd>
            </div>
          </dl>
        </div>

        {submitted ? (
          <div className="border border-border rounded p-6 bg-card">
            <h2 className="text-xl font-bold text-primary mb-2">✓ Meldung übermittelt</h2>
            <p className="text-muted-foreground mb-4">
              Vielen Dank für Ihre Meldung zu Mülleimer #{binId}. Der Betriebshof Hanau
              wird sich zeitnah kümmern.
            </p>
            <div className="flex gap-3">
              <Link
                to="/"
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-primary/90"
              >
                Zurück zur Startseite
              </Link>
              <Link
                to="/meldungen"
                className="inline-block border border-input px-4 py-2 rounded text-sm font-semibold hover:bg-muted"
              >
                Zu den Meldungen
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-border rounded bg-card">
            <div className="px-5 py-3 border-b border-border bg-secondary font-semibold">
              Ihre Meldung
            </div>
            <div className="p-5 space-y-6">
              <div>
                <label htmlFor="issue" className="block text-sm font-semibold mb-2">
                  Was ist das Problem? <span className="text-primary">*</span>
                </label>
                <select
                  id="issue"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value as IssueType)}
                  className="w-full h-11 px-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">— Bitte wählen —</option>
                  <option value="voll">Mülleimer ist voll / überfüllt</option>
                  <option value="beschaedigt">Mülleimer ist beschädigt</option>
                </select>
              </div>

              <div>
                <label htmlFor="photo" className="block text-sm font-semibold mb-2">
                  Foto hochladen (optional)
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhoto}
                  className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold hover:file:bg-primary/90"
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Vorschau"
                    className="mt-3 max-h-48 rounded border border-border"
                  />
                )}
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-semibold mb-2">
                  Kommentar (optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Weitere Details, z. B. seit wann der Mülleimer überfüllt ist."
                  className="w-full px-3 py-2 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="text-xs text-muted-foreground mt-1">{comment.length} / 500</div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-border bg-secondary flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link
                to="/"
                className="px-5 py-2.5 border border-input rounded text-sm font-semibold text-center hover:bg-muted"
              >
                Abbrechen
              </Link>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90"
              >
                Meldung absenden
              </button>
            </div>
          </form>
        )}
      </div>
    </HanauLayout>
  );
}
