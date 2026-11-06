import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/data";

/**
 * Floating click-to-chat button. In South Africa a large share of clients
 * would rather WhatsApp than fill in a form, and the site had no instant
 * channel at all. Bottom-right, clear of the iOS home indicator, and sized
 * to a 48px touch target.
 */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Tshabu Productions on WhatsApp"
      className="fixed right-4 z-30 flex h-12 items-center gap-2 rounded-full bg-[#1f7a4d] px-4 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tshabu-black md:right-6"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}
