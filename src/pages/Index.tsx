import { Link } from "react-router-dom";
import { Award, Clock, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";
import productWoodenBox from "@/assets/product-wooden-box.jpg";
import productPallet from "@/assets/product-pallet.jpg";
import productCrate from "@/assets/product-crate.jpg";

const stats = [
  { icon: Clock, value: "30+", label: "Years Experience" },
  { icon: TrendingUp, value: "₹3-5 Cr", label: "Annual Turnover" },
  { icon: Users, value: "20+", label: "Skilled Workers" },
  { icon: Award, value: "100%", label: "Quality Assurance" },
];

const featuredProducts = [
  { name: "Wooden Boxes", image: productWoodenBox, desc: "Heavy-duty boxes for safe transport and storage" },
  { name: "Wooden Pallets", image: productPallet, desc: "Standard & custom pallets for logistics" },
  { name: "Wooden Crates", image: productCrate, desc: "Robust crates for industrial packaging" },
];

const Index = () => (
  <div>
    {/* Hero */}
    <section className="relative min-h-[85vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroBg} alt="EMMES Industries warehouse" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
      </div>
      <div className="relative container-max px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/90 text-secondary-foreground text-sm font-medium mb-6">
            Established 1994
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
            Quality Wooden Packaging Solutions
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-lg">
            Trusted manufacturer of wooden boxes, pallets, crates, plywood boxes & cable drums. Delivering excellence for over 30 years.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gradient-wood border-0 text-white font-semibold hover:opacity-90 transition-opacity">
              <Link to="/products">View Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
              <Link to="/enquiry">Send Enquiry</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="gradient-forest">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-primary-foreground">
              <s.icon className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-display font-bold">{s.value}</div>
              <div className="text-sm opacity-70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Featured Products */}
    <section className="section-padding bg-background">
      <div className="container-max">
        <SectionHeading title="Our Products" subtitle="Premium wooden packaging solutions for every industry need" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((p, i) => (
            <div
              key={p.name}
              className={`group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-up${i > 0 ? `-delay-${i}` : ""}`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-secondary hover:text-accent transition-colors"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild className="gradient-forest text-primary-foreground border-0 hover:opacity-90">
            <Link to="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="gradient-wood section-padding">
      <div className="container-max text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Need Custom Packaging Solutions?</h2>
        <p className="text-white/80 max-w-lg mx-auto mb-8">
          We manufacture custom wooden packaging tailored to your specific requirements. Get in touch today.
        </p>
        <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 bg-transparent">
          <Link to="/enquiry">Get a Quote</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default Index;
