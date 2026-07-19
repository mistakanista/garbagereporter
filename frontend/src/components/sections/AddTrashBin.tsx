import { useState, useMemo } from "react";
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
        title: "Fehlende Information",
        description: "Bitte Eimer Nummer angegeben",
        variant: "destructive",
      });
      return;
    }

    if (!formData.type.trim()) {
          toast({
            title: "Fehlende Information",
            description: "Bitte Eimer Typ angegeben",
            variant: "destructive",
          });
          return;
        }

    if (!formData.location.trim()) {
      toast({
        title: "Fehlende Information",
        description: "Bitte Beschreibung des Orts angeben",
        variant: "destructive",
      });
      return;
    }

    if (!formData.district.trim()) {
      toast({
        title: "Fehlende Information",
        description: "Bitte Stadteil auswählen",
        variant: "destructive",
      });
      return;
    }

    if (!formData.zip.trim()) {
      toast({
        title: "Fehlende Information",
        description: "Bitte PLZ angeben",
        variant: "destructive",
      });
      return;
    }

    if (!formData.city.trim()) {
      toast({
        title: "Fehlende Information",
        description: "Bitte Ortsnamen angeben",
        variant: "destructive",
      });
      return;
    }

    if (!formData.latitude.trim() || !formData.longitude.trim()) {
          toast({
            title: "Fehlende Information",
            description: "Bitte Geokoordinaten angeben.",
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
        title: "Nummer vergeben",
        description: "Diese Eimer Nummer ist bereits vergeben.",
        variant: "destructive",
      });
    } else if (response.status >= 400) {
      toast({
        title: "Eimer hinzufügen fehlgeschlagen",
        description: "Beim Speichern des Eimers ist ein Fehler aufgetreten",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Eimer erfolgreich hinzugefügt",
        description: "Es können jetzt Meldungen für den Eimer hinzugefügt werden",
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
              Mülleimer Verwaltung
            </h2>
            <p className="text-lg text-muted-foreground">
                Hier können neue Mülleimer hinzugefügt werden. Bitte die Nummer, den Typ, den Ort und die Geokoordinaten angeben.
            </p>
          </div>

          <Card className="glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Eimer hinzufügen
              </CardTitle>
              <CardDescription>
                Bitte die Felder ausfüllen und auf "Eimer hinzufügen" klicken.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="number" className="flex items-center gap-2">
                    <Hash size={16} />
                    Nummer *
                  </Label>
                  <Input
                    id="number"
                    placeholder="Mülleimer Nummer"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="flex items-center gap-2">
                    <FileType size={16} />
                    Typ *
                  </Label>
                  <Input
                    id="type"
                    placeholder="Mülleimer Typ"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <Locate size={16} />
                    Beschreibung des Orts *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Beschreibung der Lage"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street" className="flex items-center gap-2">
                    <Road size={16} />
                    Straße
                  </Label>
                  <Input
                    id="street"
                    placeholder="Straße"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="houseNumber" className="flex items-center gap-2">
                    <House size={16} />
                    Hausnummer
                  </Label>
                  <Input
                    id="houseNumber"
                    placeholder="Hausnummer"
                    value={formData.houseNumber}
                    onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="flex items-center gap-2">
                    <Locate size={16} />
                    Stadtteil *
                  </Label>
                  <Select
                      value={formData.district}
                      onValueChange={(value) => setFormData({ ...formData, district: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Stadteil auswählen" />
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
                    PLZ *
                  </Label>
                  <Input
                      id="zip"
                      placeholder="PLZ"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="h-12"
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <Building2 size={16} />
                    Stadt *
                  </Label>
                  <Input
                      id="city"
                      placeholder="Stadt"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-12"
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude" className="flex items-center gap-2">
                    <MapPin size={16} />
                    Latitude *
                  </Label>
                  <Input
                      id="latitude"
                      placeholder="Latitude"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="h-12"
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="flex items-center gap-2">

                    <MapPin size={16} />
                    Longitude *
                   </Label>
                  <Input
                      id="longitude"
                      placeholder="Longitude"
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
                    <>Processing...</>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Mülleimer hinzufügen
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
