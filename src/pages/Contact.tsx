import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const Contact = () => (
  <div>
    <section className="gradient-forest section-padding pt-12 pb-12">
      <div className="container-max text-center">
        <h1 className="text-4xl font-display font-bold text-primary-foreground">Contact Us</h1>
        <p className="text-primary-foreground/70 mt-2">We'd love to hear from you</p>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <SectionHeading title="Get In Touch" subtitle="Reach out to us for any queries or orders" />

            <div className="space-y-5">
              <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg gradient-forest flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Address</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    51/2, Ranganayaki Nagar Extension,<br />
                    Periyanaickenpalayam,<br />
                    Coimbatore – 641020,<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg gradient-wood flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Mobile</h3>
                  <a href="tel:+919843167364" className="text-sm text-muted-foreground mt-1 block hover:text-secondary transition-colors">
                    +91 9843167364
                  </a>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg gradient-forest flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a href="mailto:emmes2010@gmail.com" className="text-sm text-muted-foreground mt-1 block hover:text-secondary transition-colors">
                    emmes2010@gmail.com
                  </a>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg gradient-wood flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Sister Concern</h3>
                  <p className="text-sm text-muted-foreground mt-1">ESS GEE Packaging</p>
                  <p className="text-xs text-muted-foreground">GST: 33AQUPS6145A1ZP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="animate-fade-up">
            <div className="rounded-xl overflow-hidden border border-border shadow-sm h-full min-h-[400px]">
              <iframe
                title="EMMES Industries Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.5!2d76.94!3d11.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDEwJzEyLjAiTiA3NsKwNTYnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                className="w-full h-full min-h-[400px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Contact;
