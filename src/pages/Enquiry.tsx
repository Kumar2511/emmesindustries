import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const products = [
  "Wooden Doors",
  "Wooden Chairs",
  "Wooden Tables",
  "Wooden Beds",
  "Wooden Cabinets / Wardrobes",
  "Wooden Boxes",
  "Wooden Pallets",
  "Wooden Crates",
  "Cable Drums",
  "Other",
];

const Enquiry = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", phone: "", email: "", product: "", quantity: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.product) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    const message = [
      `*New Enquiry from EMMES Industries Website*`,
      ``,
      `*Name:* ${form.name}`,
      form.company ? `*Company:* ${form.company}` : null,
      `*Phone:* ${form.phone}`,
      form.email ? `*Email:* ${form.email}` : null,
      `*Product Required:* ${form.product}`,
      form.quantity ? `*Quantity:* ${form.quantity}` : null,
      form.message ? `*Message:* ${form.message}` : null,
    ].filter(Boolean).join("%0A");

    const whatsappUrl = `https://wa.me/919843167364?text=${encodeURIComponent(message).replace(/%250A/g, '%0A')}`;
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
    toast({ title: "Redirecting to WhatsApp..." });
  };

  if (submitted) {
    return (
      <div>
        <section className="gradient-forest section-padding pt-12 pb-12">
          <div className="container-max text-center">
            <h1 className="text-4xl font-display font-bold text-primary-foreground">Enquiry</h1>
          </div>
        </section>
        <section className="section-padding bg-background">
          <div className="container-max max-w-md text-center animate-fade-up">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">Your enquiry has been submitted. We will get back to you shortly.</p>
            <Button onClick={() => { setSubmitted(false); setForm({ name: "", company: "", phone: "", email: "", product: "", quantity: "", message: "" }); }} className="gradient-forest text-primary-foreground border-0">
              Submit Another Enquiry
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
          <h1 className="text-4xl font-display font-bold text-primary-foreground">Send Enquiry</h1>
          <p className="text-primary-foreground/70 mt-2">Tell us about your requirements</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name</label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone *</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Product Required *</label>
                <Select value={form.product} onValueChange={(v) => setForm({ ...form, product: v })}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {products.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Quantity</label>
                <Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 100 units" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Additional details..." rows={4} />
            </div>
            <Button type="submit" size="lg" className="w-full gradient-wood border-0 text-white hover:opacity-90">
              Submit Enquiry via WhatsApp
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Enquiry;
