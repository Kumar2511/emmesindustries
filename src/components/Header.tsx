import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, Menu, X, ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Products", path: "/products" },
  { label: "Clients", path: "/clients" },
  { label: "Enquiry", path: "/enquiry" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="gradient-forest text-primary-foreground">
        <div className="container-max flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+919843167364" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">+91 9843167364</span>
            </a>
            <a href="mailto:emmes2010@gmail.com" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">emmes2010@gmail.com</span>
            </a>
          </div>
          <span className="text-xs opacity-80">Since 1994</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container-max flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-wood flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground leading-tight">EMMES Industries</h1>
              <p className="text-[10px] text-muted-foreground leading-tight tracking-wider uppercase">Wooden Products</p>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path || (link.path === "/products" && location.pathname.startsWith("/products"))
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2 rounded-md hover:bg-muted transition-colors text-foreground">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-secondary text-secondary-foreground">
                  {count}
                </Badge>
              )}
            </Link>

            {user ? (
              <div className="hidden lg:flex items-center gap-1">
                {isAdmin && (
                  <Link to="/admin" className="p-2 rounded-md hover:bg-muted transition-colors text-foreground" title="Admin Panel">
                    <Shield className="h-5 w-5" />
                  </Link>
                )}
                <button onClick={signOut} className="p-2 rounded-md hover:bg-muted transition-colors text-foreground" title="Sign Out">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden lg:flex p-2 rounded-md hover:bg-muted transition-colors text-foreground" title="Sign In">
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-card">
            <ul className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-border pt-2 mt-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { signOut(); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                    Sign In / Register
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
