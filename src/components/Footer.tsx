import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="gradient-forest text-primary-foreground">
    <div className="container-max section-padding pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-display font-bold mb-4">EMMES Industries</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Quality Wooden Packaging Solutions Since 1994. Manufacturing wooden boxes, pallets, crates, and cable drums
            with precision and commitment to excellence.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            {["About Us", "Products", "Clients", "Enquiry", "Contact"].map((l) => (
              <li key={l}>
                <Link to={`/${l.toLowerCase().replace(" ", "-").replace("about-us", "about")}`} className="hover:opacity-100 transition-opacity">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>51/2, Ranganayaki Nagar Extension, Periyanaickenpalayam, Coimbatore – 641020, Tamil Nadu</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href="tel:+919843167364">+91 9843167364</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:emmes2010@gmail.com">emmes2010@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs opacity-60">
        © {new Date().getFullYear()} EMMES Industries. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
