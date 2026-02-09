import { CheckCircle } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import aboutFactory from "@/assets/about-factory.jpg";

const products = [
  "Wooden Boxes",
  "Wooden Cable Drums",
  "Pallets",
  "Crates",
  "Plywood Boxes",
];

const About = () => (
  <div>
    {/* Page banner */}
    <section className="gradient-forest section-padding pt-12 pb-12">
      <div className="container-max text-center">
        <h1 className="text-4xl font-display font-bold text-primary-foreground">About Us</h1>
        <p className="text-primary-foreground/70 mt-2">Know more about EMMES Industries</p>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal variant="slide-left">
            <img src={aboutFactory} alt="Our factory" className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]" />
          </ScrollReveal>
          <ScrollReveal variant="slide-right" delay={0.15}>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Established in <span className="text-gradient-wood">1994</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              EMMES Industries is a partnership firm established in 1994, engaged in manufacturing high-quality
              wooden packaging products. With over 30 years of expertise, we have built a reputation for
              delivering reliable, durable, and cost-effective packaging solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our well-equipped infrastructure features advanced machinery operated by 20+ skilled workers,
              enabling us to handle bulk orders with precision and timely delivery.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground"><strong className="text-foreground">GST:</strong> 33AABFE2488B1ZW</p>
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-3">We Manufacture</h3>
            <StaggerContainer className="space-y-2" staggerDelay={0.08}>
              {products.map((p) => (
                <StaggerItem key={p}>
                  <li className="flex items-center gap-2 text-muted-foreground list-none">
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                    {p}
                  </li>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Quality Policy */}
    <section className="gradient-wood section-padding">
      <ScrollReveal className="container-max text-center text-white max-w-3xl" variant="scale-in">
        <h2 className="text-3xl font-display font-bold mb-4">Our Quality Policy</h2>
        <p className="text-lg opacity-90 leading-relaxed">
          "We are committed to achieving total customer satisfaction by providing superior quality wooden
          packaging products with timely delivery, competitive pricing, and continuous improvement in all
          our processes."
        </p>
      </ScrollReveal>
    </section>
  </div>
);

export default About;
