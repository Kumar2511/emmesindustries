import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Clock, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          src={heroBg}
          alt="EMMES Industries warehouse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
      </div>
      <div className="relative container-max px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block px-4 py-1.5 rounded-full bg-secondary/90 text-secondary-foreground text-sm font-medium mb-6"
          >
            Established 1994
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6"
          >
            Quality Wooden Packaging Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg text-white/80 mb-8 max-w-lg"
          >
            Trusted manufacturer of wooden boxes, pallets, crates, plywood boxes & cable drums. Delivering excellence for over 30 years.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild size="lg" className="gradient-wood border-0 text-white font-semibold hover:opacity-90 transition-opacity">
              <Link to="/products">View Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
              <Link to="/enquiry">Send Enquiry</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="gradient-forest">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.12}>
          {stats.map((s) => (
            <StaggerItem key={s.label} variant="fade-up">
              <div className="text-center text-primary-foreground">
                <s.icon className="h-8 w-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-display font-bold">{s.value}</div>
                <div className="text-sm opacity-70 mt-1">{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>

    {/* Featured Products */}
    <section className="section-padding bg-background">
      <div className="container-max">
        <SectionHeading title="Our Products" subtitle="Premium wooden packaging solutions for every industry need" />
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {featuredProducts.map((p) => (
            <StaggerItem key={p.name} variant="scale-in">
              <div className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
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
            </StaggerItem>
          ))}
        </StaggerContainer>
        <ScrollReveal className="text-center mt-10" delay={0.3}>
          <Button asChild className="gradient-forest text-primary-foreground border-0 hover:opacity-90">
            <Link to="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>

    {/* CTA */}
    <section className="gradient-wood section-padding">
      <div className="container-max text-center text-white">
        <ScrollReveal variant="fade-up">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Need Custom Packaging Solutions?</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            We manufacture custom wooden packaging tailored to your specific requirements. Get in touch today.
          </p>
          <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 bg-transparent">
            <Link to="/enquiry">Get a Quote</Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  </div>
);

export default Index;
