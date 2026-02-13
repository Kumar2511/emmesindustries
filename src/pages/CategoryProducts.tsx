import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Loader2, ShoppingCart, Eye, Search, ArrowLeft } from "lucide-react";

const woodTypes = ["All", "Teak", "Rosewood", "Plywood", "Pine", "Sal Wood"];

const CategoryProducts = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products, isLoading } = useProducts(slug);
  const { data: categories } = useCategories();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [woodFilter, setWoodFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("none");
  const [selectedProduct, setSelectedProduct] = useState<(typeof products extends (infer T)[] | undefined ? T : never) | null>(null);

  const category = categories?.find((c) => c.slug === slug);

  const filtered = products
    ?.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (woodFilter !== "All" && p.wood_type !== woodFilter) return false;
      if (stockFilter === "in-stock" && !p.in_stock) return false;
      if (stockFilter === "out-of-stock" && p.in_stock) return false;
      return true;
    })
    .sort((a, b) => {
      if (priceSort === "low-high") return a.price - b.price;
      if (priceSort === "high-low") return b.price - a.price;
      return 0;
    });

  const handleAddToCart = (product: NonNullable<typeof products>[number]) => {
    if (!product.in_stock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      wood_type: product.wood_type,
    });
    toast({ title: `${product.name} added to cart` });
  };

  return (
    <div>
      <section className="gradient-forest section-padding pt-12 pb-12">
        <div className="container-max text-center">
          <h1 className="text-4xl font-display font-bold text-primary-foreground">
            {category?.name || "Products"}
          </h1>
          <p className="text-primary-foreground/70 mt-2">{category?.description}</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-secondary hover:text-accent mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Categories
          </Link>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
            </div>
            <Select value={woodFilter} onValueChange={setWoodFilter}>
              <SelectTrigger><SelectValue placeholder="Wood Type" /></SelectTrigger>
              <SelectContent>
                {woodTypes.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger><SelectValue placeholder="Availability" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceSort} onValueChange={setPriceSort}>
              <SelectTrigger><SelectValue placeholder="Sort by Price" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Default</SelectItem>
                <SelectItem value="low-high">Price: Low to High</SelectItem>
                <SelectItem value="high-low">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          ) : !filtered?.length ? (
            <p className="text-center text-muted-foreground py-16">No products found matching your filters.</p>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" staggerDelay={0.06}>
              {filtered.map((p) => (
                <StaggerItem key={p.id} variant="scale-in">
                  <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                    <div className="aspect-square overflow-hidden bg-muted relative">
                      <img
                        src={p.image_url || "/placeholder.svg"}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!p.in_stock && (
                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                          <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-display font-semibold text-foreground">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{p.wood_type} • {p.dimensions}</p>
                      <p className="text-lg font-bold text-secondary mt-2">₹{p.price.toLocaleString("en-IN")}</p>
                      <div className="flex gap-2 mt-auto pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedProduct(p)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 gradient-wood border-0 text-white hover:opacity-90"
                          disabled={!p.in_stock}
                          onClick={() => handleAddToCart(p)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{selectedProduct?.name}</DialogTitle>
            <DialogDescription>{selectedProduct?.categories?.name}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img src={selectedProduct.image_url || "/placeholder.svg"} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Price:</span> <strong className="text-secondary">₹{selectedProduct.price.toLocaleString("en-IN")}</strong></div>
                <div><span className="text-muted-foreground">Wood Type:</span> <strong>{selectedProduct.wood_type}</strong></div>
                <div><span className="text-muted-foreground">Dimensions:</span> <strong>{selectedProduct.dimensions || "N/A"}</strong></div>
                <div><span className="text-muted-foreground">Status:</span> {selectedProduct.in_stock ? <Badge className="bg-green-600 text-white">In Stock</Badge> : <Badge variant="destructive">Out of Stock</Badge>}</div>
              </div>
              <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
              <Button
                className="w-full gradient-wood border-0 text-white hover:opacity-90"
                disabled={!selectedProduct.in_stock}
                onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryProducts;
