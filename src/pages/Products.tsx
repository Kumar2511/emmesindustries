import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useProducts";
import { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { Loader2, ArrowRight, Award, Truck, Paintbrush, Leaf } from "lucide-react";

import catDoors from "@/assets/cat-wooden-doors.jpg";
import catChairs from "@/assets/cat-wooden-chairs.jpg";
import catTables from "@/assets/cat-wooden-tables.jpg";
import catBeds from "@/assets/cat-wooden-beds.jpg";
import catCabinets from "@/assets/cat-wooden-cabinets.jpg";

const categoryImages: Record<string, string> = {
  "wooden-doors": catDoors,
  "wooden-chairs": catChairs,
  "wooden-tables": catTables,
  "wooden-beds": catBeds,
  "wooden-cabinets": catCabinets,
};

const highlights = [
  { icon: Award, title: "Premium Quality Wood", desc: "Only the finest teak, rosewood, and sal wood" },
  { icon: Paintbrush, title: "Custom Designs", desc: "Tailored to your specifications" },
  { icon: Truck, title: "Bulk Orders Accepted", desc: "Competitive pricing for large orders" },
  { icon: Leaf, title: "Eco-Friendly Materials", desc: "Sustainably sourced wood" },
];

const Products = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <div>
      <section className="gradient-forest section-padding pt-12 pb-12">
        <div className="container-max text-center">
          <h1 className="text-4xl font-display font-bold text-primary-foreground">Our Products</h1>
          <p className="text-primary-foreground/70 mt-2">Quality Wooden Solutions for Modern Living</p>
        </div>
      </section>

      {/* Highlights */}
      <section className="gradient-wood py-10">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.1}>
            {highlights.map((h) => (
              <StaggerItem key={h.title} variant="fade-up">
                <div className="text-center text-white">
                  <h.icon className="h-8 w-8 mx-auto mb-2 opacity-90" />
                  <h3 className="font-display font-semibold text-sm">{h.title}</h3>
                  <p className="text-xs opacity-80 mt-1">{h.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <SectionHeading title="Browse Categories" subtitle="Explore our wide range of handcrafted wooden products" />

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
              {categories?.map((cat) => (
                <StaggerItem key={cat.id} variant="scale-in">
                  <Link
                    to={`/products/${cat.slug}`}
                    className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 block"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={categoryImages[cat.slug] || "/placeholder.svg"}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-lg text-foreground">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-secondary hover:text-accent transition-colors">
                        Browse Products <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
