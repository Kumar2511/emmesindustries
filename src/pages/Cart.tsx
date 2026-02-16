import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, Loader2, Copy, Smartphone, Upload } from "lucide-react";

const UPI_ID = "emmesindustries@upi";

const upiApps = [
  { name: "Google Pay", scheme: "tez://upi/pay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" },
  { name: "PhonePe", scheme: "phonepe://pay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" },
  { name: "Paytm", scheme: "paytmmp://upi/pay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" },
  { name: "BHIM", scheme: "upi://pay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png" },
];

type Step = "cart" | "checkout" | "payment" | "confirm" | "done";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("cart");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast({ title: "UPI ID copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const openUpiApp = (scheme: string) => {
    const url = `${scheme}?pa=${UPI_ID}&pn=EMMES%20Industries&am=${total}&cu=INR`;
    window.open(url, "_blank");
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.pincode.trim()) {
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
      const { data, error } = await supabase.from("orders").insert({
        user_id: user.id,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_address: `${form.address.trim()}, ${form.city.trim()} - ${form.pincode.trim()}`,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image_url: i.image_url })),
        total,
        payment_method: "upi",
        payment_status: "pending",
      }).select("id").single();
      if (error) throw error;
      setOrderId(data.id);
      setStep("payment");
    } catch (err: any) {
      toast({ title: "Failed to create order", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast({ title: "Please enter the Transaction ID", variant: "destructive" });
      return;
    }
    if (!orderId) return;

    setLoading(true);
    try {
      let screenshotUrl: string | null = null;
      if (screenshotFile) {
        const ext = screenshotFile.name.split(".").pop();
        const path = `${orderId}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("payment-screenshots").upload(path, screenshotFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("payment-screenshots").getPublicUrl(path);
        screenshotUrl = publicUrl;
      }

      const { error } = await supabase.from("orders").update({
        transaction_id: transactionId.trim(),
        payment_screenshot_url: screenshotUrl,
        payment_status: "submitted",
      }).eq("id", orderId);
      if (error) throw error;

      clearCart();
      setStep("done");
      toast({ title: "Payment submitted successfully!" });
    } catch (err: any) {
      toast({ title: "Failed to submit payment details", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // === DONE STEP ===
  if (step === "done") {
    return (
      <div>
        <section className="gradient-forest section-padding pt-12 pb-12">
          <div className="container-max text-center">
            <h1 className="text-4xl font-display font-bold text-primary-foreground">Payment Submitted</h1>
          </div>
        </section>
        <section className="section-padding bg-background">
          <div className="container-max max-w-md text-center animate-fade-up">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">Payment submitted successfully. Your order is under verification. We'll contact you shortly.</p>
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
            {step === "cart" ? "Your Cart" : step === "checkout" ? "Checkout" : step === "payment" ? "Pay via UPI" : "Confirm Payment"}
          </h1>
          <p className="text-primary-foreground/70 mt-2">
            {step === "cart" && (count > 0 ? `${count} item${count > 1 ? "s" : ""} in your cart` : "Your cart is empty")}
            {step === "checkout" && "Enter your delivery details"}
            {step === "payment" && `Pay ₹${total.toLocaleString("en-IN")} to complete your order`}
            {step === "confirm" && "Enter your payment details"}
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max max-w-3xl">

          {/* === EMPTY CART === */}
          {items.length === 0 && step === "cart" && (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button asChild className="gradient-wood border-0 text-white hover:opacity-90">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          )}

          {/* === CART STEP === */}
          {items.length > 0 && step === "cart" && (
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
                    <p className="font-bold text-foreground w-24 text-right hidden sm:block">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
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
          )}

          {/* === CHECKOUT STEP === */}
          {step === "checkout" && (
            <form onSubmit={handleProceedToPayment} className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-display font-bold text-foreground">Delivery Details</h2>

              {/* Order summary */}
              <div className="space-y-3 border-b border-border pb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <p className="font-bold text-foreground text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required maxLength={100} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number *</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required maxLength={15} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Delivery Address *</label>
                <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full delivery address" rows={2} required maxLength={500} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">City *</label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" required maxLength={100} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Pincode *</label>
                  <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="6-digit pincode" required maxLength={6} />
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-xl font-display font-bold text-foreground">₹{total.toLocaleString("en-IN")}</p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("cart")} className="flex-1">Back to Cart</Button>
                <Button type="submit" disabled={loading} className="flex-1 gradient-wood border-0 text-white hover:opacity-90">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Smartphone className="mr-2 h-4 w-4" />}
                  Pay via UPI
                </Button>
              </div>
            </form>
          )}

          {/* === PAYMENT STEP === */}
          {step === "payment" && (
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-bold text-foreground mb-1">Pay ₹{total.toLocaleString("en-IN")}</h2>
                <p className="text-sm text-muted-foreground">Scan QR code or use UPI apps below</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <img src="/images/upi-qr-code.png" alt="UPI QR Code" className="w-56 h-56" />
                </div>
              </div>

              {/* UPI ID */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">UPI ID:</span>
                <code className="bg-muted px-3 py-1.5 rounded-md font-mono text-sm text-foreground">{UPI_ID}</code>
                <Button size="sm" variant="outline" onClick={copyUpi} className="h-8">
                  <Copy className="h-3 w-3 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>

              {/* UPI App buttons */}
              <div>
                <p className="text-sm text-muted-foreground text-center mb-3">Or pay using</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {upiApps.map((app) => (
                    <Button
                      key={app.name}
                      variant="outline"
                      onClick={() => openUpiApp(app.scheme)}
                      className="flex flex-col items-center gap-2 h-auto py-3 hover:border-secondary"
                    >
                      <img src={app.icon} alt={app.name} className="h-8 w-8 object-contain" />
                      <span className="text-xs">{app.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Amount summary */}
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Payable</p>
                <p className="text-2xl font-display font-bold text-foreground">₹{total.toLocaleString("en-IN")}</p>
              </div>

              <Button
                onClick={() => setStep("confirm")}
                className="w-full gradient-forest text-primary-foreground border-0 h-12 text-base"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                I Have Paid
              </Button>
            </div>
          )}

          {/* === CONFIRM STEP === */}
          {step === "confirm" && (
            <form onSubmit={handlePaymentConfirmation} className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-display font-bold text-foreground">Payment Confirmation</h2>
              <p className="text-sm text-muted-foreground">Please enter your payment details for verification.</p>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Transaction ID (UTR Number) *</label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12-digit UTR number"
                  required
                  maxLength={50}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Payment Screenshot (Optional)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-secondary/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {screenshotFile ? screenshotFile.name : "Click to upload or drag and drop"}
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                    className="opacity-0 absolute inset-0 cursor-pointer"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}>
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-xl font-display font-bold text-foreground">₹{total.toLocaleString("en-IN")}</p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("payment")} className="flex-1">Back</Button>
                <Button type="submit" disabled={loading} className="flex-1 gradient-wood border-0 text-white hover:opacity-90">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Payment
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
