import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, ShieldAlert, Package, ClipboardList } from "lucide-react";
import { Navigate } from "react-router-dom";

interface ProductForm {
  name: string;
  slug: string;
  price: string;
  wood_type: string;
  dimensions: string;
  description: string;
  category_id: string;
  in_stock: boolean;
  image_url: string;
}

const emptyForm: ProductForm = {
  name: "", slug: "", price: "", wood_type: "Teak", dimensions: "", description: "", category_id: "", in_stock: true, image_url: "",
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<"products" | "orders">("products");
  const [editProduct, setEditProduct] = useState<ProductForm | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  if (authLoading) return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="section-padding bg-background text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
      </div>
    );
  }

  const loadOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setOrdersLoaded(true);
  };

  const openNew = () => {
    setEditId(null);
    setEditProduct({ ...emptyForm, category_id: categories?.[0]?.id || "" });
    setDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setEditProduct({
      name: p.name, slug: p.slug, price: String(p.price), wood_type: p.wood_type,
      dimensions: p.dimensions || "", description: p.description || "",
      category_id: p.category_id, in_stock: p.in_stock, image_url: p.image_url || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editProduct?.name || !editProduct?.price || !editProduct?.category_id) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: editProduct.name,
      slug: editProduct.slug || editProduct.name.toLowerCase().replace(/\s+/g, "-"),
      price: parseFloat(editProduct.price),
      wood_type: editProduct.wood_type,
      dimensions: editProduct.dimensions || null,
      description: editProduct.description || null,
      category_id: editProduct.category_id,
      in_stock: editProduct.in_stock,
      image_url: editProduct.image_url || null,
    };

    try {
      if (editId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editId);
        if (error) throw error;
        toast({ title: "Product updated" });
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast({ title: "Product added" });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product deleted" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editProduct) return;
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", variant: "destructive" });
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    setEditProduct({ ...editProduct, image_url: publicUrl });
    toast({ title: "Image uploaded" });
  };

  return (
    <div>
      <section className="gradient-forest section-padding pt-12 pb-12">
        <div className="container-max text-center">
          <h1 className="text-4xl font-display font-bold text-primary-foreground">Admin Panel</h1>
          <p className="text-primary-foreground/70 mt-2">Manage products and orders</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button variant={tab === "products" ? "default" : "outline"} onClick={() => setTab("products")} className={tab === "products" ? "gradient-forest border-0 text-primary-foreground" : ""}>
              <Package className="h-4 w-4 mr-2" /> Products
            </Button>
            <Button variant={tab === "orders" ? "default" : "outline"} onClick={() => { setTab("orders"); if (!ordersLoaded) loadOrders(); }} className={tab === "orders" ? "gradient-forest border-0 text-primary-foreground" : ""}>
              <ClipboardList className="h-4 w-4 mr-2" /> Orders
            </Button>
          </div>

          {tab === "products" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-display font-bold text-foreground">All Products ({products?.length || 0})</h2>
                <Button onClick={openNew} className="gradient-wood border-0 text-white hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Product</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Category</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Price</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">Wood</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Stock</th>
                        <th className="text-right py-3 px-2 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map((p: any) => (
                        <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-2 font-medium text-foreground">{p.name}</td>
                          <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{p.categories?.name}</td>
                          <td className="py-3 px-2 text-secondary font-bold">₹{Number(p.price).toLocaleString("en-IN")}</td>
                          <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{p.wood_type}</td>
                          <td className="py-3 px-2">
                            {p.in_stock ? <Badge className="bg-green-600 text-white text-xs">In Stock</Badge> : <Badge variant="destructive" className="text-xs">Out</Badge>}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {tab === "orders" && (
            <>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Orders</h2>
              {!ordersLoaded ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
              ) : orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-16">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o: any) => (
                    <div key={o.id} className="bg-card rounded-xl border border-border p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{o.customer_name}</h3>
                          <p className="text-xs text-muted-foreground">{o.customer_phone} • {new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className={o.status === "pending" ? "bg-yellow-600 text-white" : "bg-green-600 text-white"}>{o.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{o.customer_address}</p>
                      <div className="space-y-1">
                        {(o.items as any[])?.map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-foreground">• {item.name} x{item.quantity} - ₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        ))}
                      </div>
                      <p className="text-lg font-bold text-secondary mt-2">Total: ₹{Number(o.total).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editId ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                <Input value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Price (₹) *</label>
                  <Input type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Category *</label>
                  <Select value={editProduct.category_id} onValueChange={(v) => setEditProduct({ ...editProduct, category_id: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Wood Type</label>
                  <Input value={editProduct.wood_type} onChange={(e) => setEditProduct({ ...editProduct, wood_type: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Dimensions</label>
                  <Input value={editProduct.dimensions} onChange={(e) => setEditProduct({ ...editProduct, dimensions: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <Textarea value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Product Image</label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {editProduct.image_url && (
                  <img src={editProduct.image_url} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editProduct.in_stock} onChange={(e) => setEditProduct({ ...editProduct, in_stock: e.target.checked })} id="in_stock" className="rounded" />
                <label htmlFor="in_stock" className="text-sm text-foreground">In Stock</label>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full gradient-wood border-0 text-white hover:opacity-90">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editId ? "Update Product" : "Add Product"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
