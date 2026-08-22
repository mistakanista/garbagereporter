import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileArchive, Building2, CheckCircle, Hash, FileType, Locate, MapPin, Road, House } from "lucide-react";
import {
  BIN_DB,
} from "@/lib/reports";

export const AddTrashBin = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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

  const districts = useMemo(
      () => Array.from(new Set(Object.values(BIN_DB).map((b) => b.district))).sort(),
      [],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.number.trim()) {
      toast({
        title: t("binMissingInfoTitle"),
        description: t("binMissingNumberDescription"),
        variant: "destructive",
      });
      return;
    }

    if (!formData.type.trim()) {
          toast({
            title: t("binMissingInfoTitle"),
            description: t("binMissingTypeDescription"),
            variant: "destructive",
          });
          return;
        }

    if (!formData.location.trim()) {
      toast({
        title: t("binMissingInfoTitle"),
        description: t("binMissingLocationDescription"),
        variant: "destructive",
      });
      return;
    }

    if (!formData.district.trim()) {
      toast({
        title: t("binMissingInfoTitle"),
        description: t("binMissingDistrictDescription"),
        variant: "destructive",
      });
      return;
    }

    if (!formData.zip.trim()) {
      toast({
        title: t("binMissingInfoTitle"),
        description: t("binMissingZipDescription"),
        variant: "destructive",
      });
      return;
    }

    if (!formData.city.trim()) {
      toast({
        title: t("binMissingInfoTitle"),
        description: t("binMissingCityDescription"),
        variant: "destructive",
      });
      return;
    }

    if (!formData.latitude.trim() || !formData.longitude.trim()) {
          toast({
            title: t("binMissingInfoTitle"),
            description: t("binMissingCoordinatesDescription"),
            variant: "destructive",
          });
          return;
        }

    setIsSubmitting(true);

    // Simulate API call
    const response = await fetch("/api/trashbin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: formData.number,
        type: formData.type,
        location: formData.location,
        street: formData.street,
        houseNumber: formData.houseNumber,
        district: formData.district,
        zip: formData.zip,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
      }),
    });
    console.log("resp", response);
    if (response.status === 409) {
      toast({
        title: t("binNumberTakenTitle"),
        description: t("binNumberTakenDescription"),
        variant: "destructive",
      });
    } else if (response.status >= 400) {
      toast({
        title: t("binAddFailedTitle"),
        description: t("binAddFailedDescription"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("binSuccessTitle"),
        description: t("binSuccessDescription"),
      });
      setFormData({  number: "",
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
    }

    setIsSubmitting(false);
  };

  return (
    <section id="register" className="py-24 bg-muted/50">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("binManagementTitle")}
            </h2>
            <p className="text-lg text-muted-foreground">
                {t("binManagementIntro")}
            </p>
          </div>

          <Card className="glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t("binAddTitle")}
              </CardTitle>
              <CardDescription>
                {t("binAddDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="number" className="flex items-center gap-2">
                    <Hash size={16} />
                    {t("binNumberLabel")}
                  </Label>
                  <Input
                    id="number"
                    placeholder={t("binNumberPlaceholder")}
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="flex items-center gap-2">
                    <FileType size={16} />
                    {t("binTypeLabel")}
                  </Label>
                  <Input
                    id="type"
                    placeholder={t("binTypePlaceholder")}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <Locate size={16} />
                    {t("binLocationLabel")}
                  </Label>
                  <Input
                    id="location"
                    placeholder={t("binLocationPlaceholder")}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street" className="flex items-center gap-2">
                    <Road size={16} />
                    {t("binStreetLabel")}
                  </Label>
                  <Input
                    id="street"
                    placeholder={t("binStreetPlaceholder")}
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="houseNumber" className="flex items-center gap-2">
                    <House size={16} />
                    {t("binHouseNumberLabel")}
                  </Label>
                  <Input
                    id="houseNumber"
                    placeholder={t("binHouseNumberPlaceholder")}
                    value={formData.houseNumber}
                    onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="flex items-center gap-2">
                    <Locate size={16} />
                    {t("binDistrictLabel")}
                  </Label>
                  <Select
                      value={formData.district}
                      onValueChange={(value) => setFormData({ ...formData, district: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t("binDistrictPlaceholder")} />
                      </SelectTrigger>

                      <SelectContent>
                        {districts.map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                      ))}
                      </SelectContent>
                    </Select>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="zip" className="flex items-center gap-2">
                    <FileArchive size={16} />
                    {t("binZipLabel")}
                  </Label>
                  <Input
                      id="zip"
                      placeholder={t("binZipPlaceholder")}
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="h-12"
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <Building2 size={16} />
                    {t("binCityLabel")}
                  </Label>
                  <Input
                      id="city"
                      placeholder={t("binCityPlaceholder")}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-12"
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude" className="flex items-center gap-2">
                    <MapPin size={16} />
                    {t("binLatitudeLabel")}
                  </Label>
                  <Input
                      id="latitude"
                      placeholder={t("binLatitudePlaceholder")}
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="h-12"
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="flex items-center gap-2">

                    <MapPin size={16} />
                    {t("binLongitudeLabel")}
                   </Label>
                  <Input
                      id="longitude"
                      placeholder={t("binLongitudePlaceholder")}
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="h-12"
                    />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>{t("binSubmitting")}</>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      {t("binAddButton")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
