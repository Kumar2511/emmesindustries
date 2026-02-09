import { Building2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const clients = [
  "AQUASUB Engineering Unit IV",
  "Coptech Wire & Cable Pvt Ltd",
  "Athivinayakar Wires Pvt Ltd",
  "Groz Beckert Carding India Pvt Ltd",
  "Kamadhenu Wires",
  "PPL Engineers Pvt Ltd",
  "Anuj Packaging",
  "Pranav Packaging",
  "Gowtham Packaging",
];

const Clients = () => (
  <div>
    <section className="gradient-forest section-padding pt-12 pb-12">
      <div className="container-max text-center">
        <h1 className="text-4xl font-display font-bold text-primary-foreground">Our Clients</h1>
        <p className="text-primary-foreground/70 mt-2">Trusted by leading manufacturers</p>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="container-max">
        <SectionHeading title="Companies We Serve" subtitle="We are proud to partner with industry leaders across India" />
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {clients.map((c) => (
            <StaggerItem key={c} variant="fade-up">
              <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4 hover:shadow-md hover:border-secondary/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg gradient-forest flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">{c}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  </div>
);

export default Clients;
