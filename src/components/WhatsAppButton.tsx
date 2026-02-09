import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919843167364?text=Hello%20EMMES%20Industries%2C%20I%20would%20like%20to%20enquire%20about%20your%20products."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(142,70%,41%)] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    aria-label="Contact on WhatsApp"
  >
    <MessageCircle className="h-6 w-6" />
  </a>
);

export default WhatsAppButton;
