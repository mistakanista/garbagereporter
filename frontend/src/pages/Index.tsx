import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { Registration } from "@/components/sections/Registration";
import { Sponsors } from "@/components/sections/Sponsors";
import { Topics } from "@/components/sections/Topics";
import { Schedule } from "@/components/sections/Schedule";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen code-pattern-bg">
      <Navigation />
      <Hero />
      <Registration />
      <Sponsors />
      <Topics />
      <Schedule />
      <Footer />
    </div>
  );
};

export default Index;
