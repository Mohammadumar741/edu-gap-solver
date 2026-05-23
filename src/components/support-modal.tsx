import { X } from "lucide-react";
import { useEffect } from "react";
import qrImage from "@/assets/upi-qr.jpg";

export function SupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 24px 80px -20px rgba(95, 232, 166, 0.25)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center space-y-1.5 mb-5">
          <h2 className="text-xl font-semibold tracking-tight">Support the Project</h2>
          <p className="text-xs text-muted-foreground">
            TechGap Analyzer is free & guest-friendly. Your tip keeps it ad-light.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-3 bg-white rounded-xl">
            <img
              src={qrImage}
              alt="UPI QR code"
              width={200}
              height={200}
              className="w-[200px] h-[200px] object-cover"
            />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Scan with <span className="text-foreground font-medium">GPay</span>,{" "}
          <span className="text-foreground font-medium">PhonePe</span>, or{" "}
          <span className="text-foreground font-medium">Paytm</span>
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-lg text-sm font-medium border border-border/60 hover:bg-muted/50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}