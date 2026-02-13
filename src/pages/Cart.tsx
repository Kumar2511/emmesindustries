import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, Loader2 } from "lucide-react";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Please sign in to place an order", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      // Save order to DB
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total,
      });
      if (error) throw error;

      // Also send via WhatsApp
      const itemList = items.map((i) => `• ${i.name} x${i.quantity} - ₹${(i.price * i.quantity).toLocaleString("en-IN")}`).join("%0A");
      const message = [
        `*New Order from EMMES Industries Website*`,
        ``,
        `*Customer:* ${form.name}`,
        `*Phone:* ${form.phone}`,
        `*Address:* ${form.address}`,
        ``,
        `*Items:*`,
        itemList,
        ``,
        `*Total: ₹${total.toLocaleString("en-IN")}*`,
      ].join("%0A");

      const whatsappUrl = `https://wa.me/919843167364?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      clearCart();
      setStep("done");
      toast({ title: "Order placed successfully!" });
    } catch (err: any) {
      toast({ title: "Failed to place order", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div>
        <section className="gradient-forest section-padding pt-12 pb-12">
          <div className="container-max text-center">
            <h1 className="text-4xl font-display font-bold text-primary-foreground">Order Placed</h1>
          </div>
        </section>
        <section className="section-padding bg-background">
          <div className="container-max max-w-md text-center animate-fade-up">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">Your order has been sent. We'll contact you shortly to confirm.</p>
            <Button asChild className="gradient-forest text-primary-foreground border-0">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="gradient-forest section-padding pt-12 pb-12">
        <div className="container-max text-center">
          <h1 className="text-4xl font-display font-bold text-primary-foreground">
            {step === "cart" ? "Your Cart" : "Checkout"}
          </h1>
          <p className="text-primary-foreground/70 mt-2">
            {count > 0 ? `${count} item${count > 1 ? "s" : ""} in your cart` : "Your cart is empty"}
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max max-w-3xl">
          {items.length === 0 && step === "cart" ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button asChild className="gradient-wood border-0 text-white hover:opacity-90">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : step === "cart" ? (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.wood_type}</p>
                      <p className="text-sm font-bold text-secondary">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-bold text-foreground w-24 text-right">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="bg-card rounded-xl border border-border p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-display font-bold text-foreground">₹{total.toLocaleString("en-IN")}</p>
                </div>
                <Button size="lg" className="gradient-wood border-0 text-white hover:opacity-90" onClick={() => {
                  if (!user) {
                    toast({ title: "Please sign in to checkout", variant: "destructive" });
                    navigate("/auth");
                    return;
                  }
                  setStep("checkout");
                }}>
                  Proceed to Checkout
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handlePlaceOrder} className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-display font-bold text-foreground">Delivery Details</h2>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number *</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Delivery Address *</label>
                <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full delivery address" rows={3} required />
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-xl font-display font-bold text-foreground">₹{total.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground mt-1">Payment: Cash on Delivery / Contact for UPI</p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("cart")} className="flex-1">Back to Cart</Button>
                <Button type="submit" disabled={loading} className="flex-1 gradient-wood border-0 text-white hover:opacity-90">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Place Order via WhatsApp
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
