import { useState, useRef } from "react";
import QRCode from "qrcode";
import bgPattern from "@/assets/bg-pattern.jpg";
import { QrCode, Download, Link, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Index = () => {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error("Iltimos, havolani kiriting!");
      return;
    }

    try {
      setLoading(true);
      const dataUrl = await QRCode.toDataURL(trimmed, {
        width: 400,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
      setQrDataUrl(dataUrl);
      toast.success("QR kod muvaffaqiyatli yaratildi!");
    } catch {
      toast.error("QR kodni yaratishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = qrDataUrl;
    link.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") generateQR();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      // style={{
      //   backgroundImage: `url(${bgPattern})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Xush kelibsiz!
          </h1>
          <p className="text-muted-foreground text-base">
            QR kod yaratish sayti
          </p>
        </div>

        {/* Input Card */}
        <Card className="p-6 space-y-4 shadow-lg border-border/50">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Link className="w-4 h-4 text-primary" />
            Havolani kiriting
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12 text-base"
          />
          <Button
            onClick={generateQR}
            disabled={loading}
            className="w-full h-12 text-base font-semibold gap-2"
          >
            
            {loading ? "Yaratilmoqda..." : "Yaratish"}
          </Button>
        </Card>

        {/* QR Result */}
        {qrDataUrl && (
          <Card className="p-6 space-y-4 shadow-lg border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center">
              <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64"
                />
              </div>
            </div>
            <Button
              onClick={downloadQR}
              variant="outline"
              className="w-full h-12 text-base font-semibold gap-2"
            >
              <Download className="w-4 h-4" />
              Yuklab olish
            </Button>
          </Card>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default Index;
