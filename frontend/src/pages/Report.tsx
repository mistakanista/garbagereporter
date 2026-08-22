import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          title: t("reportErrorMissingInfoTitle"),
          description: t("reportErrorMissingInfoDescription"),
          variant: "destructive",
        });
        return;
    }
    if (comment.length > 500) {
      toast({
        title: t("reportErrorLengthTitle"),
        description: t("reportErrorLengthDescription"),
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
        title: t("reportErrorBinMissingTitle"),
        description: t("reportErrorBinMissingDescription"),
        variant: "destructive",
      });
    } else if (response.status >= 400) {
      toast({
        title: t("reportErrorSubmitTitle"),
        description: t("reportErrorSubmitDescription"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("reportSuccessTitle"),
        description: t("reportSuccessDescription"),
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
    <HanauLayout breadcrumb={t("reportBreadcrumb", { binId })}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("reportTitle")}</h1>
        <p className="text-muted-foreground mb-6">
          {t("reportIntro")}
        </p>

        <div className="border-l-4 border-primary bg-accent/60 p-5 mb-8 rounded-r">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            {t("reportDetectedBin")}
          </div>
          <div className="text-xl font-bold">{bin.type} #{binId}</div>
          <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">{t("reportLocation")}</dt>
              <dd className="font-semibold">{bin.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("reportDistrict")}</dt>
              <dd className="font-semibold">{bin.district}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("reportAddress")}</dt>
              <dd className="font-semibold">{bin.street} {bin.houseNumber}<br />{bin.zip} {bin.city}</dd>
            </div>
          </dl>
        </div>

        {submitted ? (
          <div className="border border-border rounded p-6 bg-card">
            <h2 className="text-xl font-bold text-primary mb-2">{t("reportSubmittedTitle")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("reportSubmittedDescription", { binId })}
            </p>
            <div className="flex gap-3">
              <Link
                to="/"
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-primary/90"
              >
                {t("reportBackHome")}
              </Link>
              <Link
                to="/meldungen"
                className="inline-block border border-input px-4 py-2 rounded text-sm font-semibold hover:bg-muted"
              >
                {t("reportToReports")}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-border rounded bg-card">
            <div className="px-5 py-3 border-b border-border bg-secondary font-semibold">
              {t("reportYourReport")}
            </div>
            <div className="p-5 space-y-6">
              <div>
                <label htmlFor="issue" className="block text-sm font-semibold mb-2">
                  {t("reportIssueLabel")} <span className="text-primary">*</span>
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t("reportIssuePlaceholder")} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="voll">{t("reportIssueFull")}</SelectItem>
                    <SelectItem value="beschaedigt">{t("reportIssueDamaged")}</SelectItem>
                    <SelectItem value="illegal">{t("reportIssueIllegal")}</SelectItem>
                    <SelectItem value="beschmiert">{t("reportIssueDirty")}</SelectItem>
                    <SelectItem value="sonstiges">{t("reportIssueOther")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <LogoUpload formData={formData} setFormData={setFormData} />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold mb-2">
                  {t("reportCommentLabel")}
                </label>
                <textarea
                  id="description"
                  value={formData.description}

                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  maxLength={500}
                  placeholder={t("reportCommentPlaceholder")}
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
                {t("reportCancel")}
              </Link>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>{t("reportSubmitting")}</>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    {t("reportSubmit")}
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
