import { useEffect } from "react";
import { CheckCircle, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const phoneNumber = "556294330111";
  const message = encodeURIComponent("Olá! Gostaria de acompanhar meu pedido.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Success Icon */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-display font-bold text-foreground">
              Pagamento Confirmado!
            </h1>
            <p className="text-muted-foreground">Seu pedido foi aprovado com sucesso</p>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h2 className="font-semibold text-foreground mb-1">
                Preparando seu pedido
              </h2>
              <p className="text-sm text-muted-foreground">
                Seu produto será enviado em até 24 horas úteis. Você receberá o código
                de rastreamento em breve.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Fique tranquilo! Você receberá atualizações sobre seu pedido por email
            </p>
          </div>
        </div>

        {/* WhatsApp Button (link direto, mais robusto que window.open) */}
        <Button asChild size="lg" className="w-full gap-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
            Acompanhar Pedido no WhatsApp
          </a>
        </Button>

        {/* Back to Home */}
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          size="lg"
          className="w-full"
        >
          Voltar para Home
        </Button>
      </div>
    </div>
  );
}
