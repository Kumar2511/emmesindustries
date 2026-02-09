import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

import imgBox from "@/assets/product-wooden-box.jpg";
import imgPallet from "@/assets/product-pallet.jpg";
import imgCrate from "@/assets/product-crate.jpg";
import imgPine from "@/assets/product-pine-box.jpg";
import imgPlywood from "@/assets/product-plywood-box.jpg";
import imgDrum from "@/assets/product-cable-drum.jpg";

const products = [
  { name: "Wooden Boxes", image: imgBox, desc: "Heavy-duty wooden boxes designed for safe transportation and storage of goods. Custom sizes available.", usage: "Transport, Storage, Industrial Goods" },
  { name: "Wooden Pallets", image: imgPallet, desc: "Standard and custom-sized pallets manufactured for efficient logistics and warehousing.", usage: "Logistics, Warehousing, Export" },
  { name: "Wooden Crates", image: imgCrate, desc: "Robust wooden crates built for protecting heavy machinery and industrial equipment during transit.", usage: "Heavy Goods, Machinery, Industrial" },
  { name: "Pine Wood Boxes", image: imgPine, desc: "Premium pine wood boxes ideal for export packaging with excellent durability and light weight.", usage: "Export, Delicate Items, Electronics" },
  { name: "Plywood Boxes", image: imgPlywood, desc: "Cost-effective plywood packaging boxes suitable for domestic and international shipping.", usage: "Shipping, Storage, Commercial" },
  { name: "Cable Drums", image: imgDrum, desc: "Precision-manufactured wooden cable drums for the wire and cable industry.", usage: "Cable Industry, Wire Spooling" },
];

const Products = () => (
  <div>
    <section className="gradient-forest section-padding pt-12 pb-12">
      <div className="container-max text-center">
        <h1 className="text-4xl font-display font-bold text-primary-foreground">Our Products</h1>
        <p className="text-primary-foreground/70 mt-2">Premium wooden packaging for every need</p>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="container-max">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
          {products.map((p) => (
            <StaggerItem key={p.name} variant="scale-in">
              <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-semibold text-lg text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex-1">{p.desc}</p>
                  <p className="text-xs text-secondary font-medium mt-2">Usage: {p.usage}</p>
                  <Button asChild className="mt-4 gradient-wood border-0 text-white hover:opacity-90 w-full">
                    <Link to="/enquiry">Send Enquiry</Link>
                  </Button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  </div>
);

export default Products;
