import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Building, ArrowRight } from "lucide-react";

export const Registration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms to register.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "You're in! 🎉",
      description: "You're registered for Developer Barcamp Frankfurt 2026.",
    });

    setFormData({ name: "", email: "", company: "", agreeTerms: false });
    setIsSubmitting(false);
  };

  return (
    <section id="register" className="py-24 mesh-bg">
      <div className="section-container">
        <div className="max-w-lg mx-auto">
          <div className="mb-10">
            <p className="text-xs font-mono text-primary tracking-widest uppercase mb-3">Registration</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              Grab your spot
            </h2>
            <p className="text-muted-foreground">
              Free entry. Limited to 200 participants.
            </p>
          </div>

          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Your details</CardTitle>
              <CardDescription className="text-sm">
                We'll send a confirmation to your email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm flex items-center gap-1.5">
                    <User size={14} className="text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Jane Developer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm flex items-center gap-1.5">
                    <Mail size={14} className="text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-sm flex items-center gap-1.5">
                    <Building size={14} className="text-muted-foreground" />
                    Company
                    <span className="text-muted-foreground font-normal">— optional</span>
                  </Label>
                  <Input
                    id="company"
                    placeholder="Acme Inc."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="flex items-start space-x-2.5 pt-1">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    className="mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    I understand this is an unconference — session topics are proposed on the day by participants.
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Registering…" : (
                    <>
                      Complete Registration
                      <ArrowRight size={16} />
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
