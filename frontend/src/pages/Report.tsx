import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HanauLayout from "@/components/HanauLayout";
import { reportsStore, IssueType } from "@/lib/reports";
import { LogoUpload } from "@/components/sections/LogoUpload";
import { CheckCircle } from "lucide-react";

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
  const { toast } = useToast();
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
  const [formData, setFormData] = useState({
      trashbinId: "",
      type: "",
      image: "",
      description: "",
    });
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setPhotoPreview(null);
      return;
    }
    const dataUrl = await fileToDataUrl(f);
    setPhotoPreview(dataUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) {
        toast({
          title: "Information fehlt",
          description: "Bitte wählen Sie ein Problem aus",
          variant: "destructive",
        });
        return;
    }
    if (comment.length > 500) {
      toast({
        title: "Zeichen Limit",
        description: "Kommentar zu lang (max. 500 Zeichen).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          trashbinId: binId,
          type: formData.type,
        image: formData.image,
        description: formData.description,
      }),
    });
    console.log("resp", response);
    if (response.status === 412) {
      toast({
        title: "Mülleimer nicht vorhanden",
        description: "Kein Eimer mit dieser Nummer ist registriert",
        variant: "destructive",
      });
    } else if (response.status >= 400) {
      toast({
        title: "Fehler beim Hinzufügen der Meldung",
        description: "Beim Hinzufügen der Meldung ist ein Fehler aufgetreten",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Meldung erfolgreich hinzugefügt! ☕",
        description: "Unsere Mitarbeiter werden sich darum kümmern!",
      });
      setFormData({trashbinId: "",
                          type: "",
                          image: "",
                          description: "", });
    }

    setIsSubmitting(false);
    setSubmitted(true);
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
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="voll">Mülleimer ist voll / überfüllt</SelectItem>
                    <SelectItem value="beschaedigt">Mülleimer ist beschädigt</SelectItem>
                    <SelectItem value="illegal">Illegale Ablagerungen in der Nähe</SelectItem>
                    <SelectItem value="beschmiert">Mülleimer ist beschmiert / Graffitti</SelectItem>
                    <SelectItem value="sonstiges">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <LogoUpload formData={formData} setFormData={setFormData} />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold mb-2">
                  Kommentar (optional)
                </label>
                <textarea
                  id="description"
                  value={formData.description}

                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Meldung absenden
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </HanauLayout>
  );
}
