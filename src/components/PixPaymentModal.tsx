import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePix } from "@/hooks/usePix";
import { Copy, CheckCircle, Loader2, QrCode as QrCodeIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import { trackAddPaymentInfo, trackPlaceAnOrder } from "@/lib/tiktok-tracking";
import { metaTrackAddPaymentInfo } from "@/lib/meta-tracking";

interface PixPaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: () => void;
}

export const PixPaymentModal = ({ open, onClose, amount, onPaymentSuccess }: PixPaymentModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [hasTrackedPaymentInfo, setHasTrackedPaymentInfo] = useState(false);
  
  const { createPix, loading, error, pixData, isPaid, reset } = usePix(() => {
    // Pagamento confirmado - o evento de Purchase é enviado pelo webhook server-side
    toast({
      title: "✅ Pagamento Confirmado!",
      description: "Pedido aprovado com sucesso.",
    });

    // Fecha o modal e deixa o redirect por conta do pai (Checkout)
    setTimeout(() => {
      handleClose();
      onPaymentSuccess();
    }, 300);
  });

  const handleClose = () => {
    reset();
    setCopied(false);
    setHasTrackedPaymentInfo(false);
    onClose();
  };

  // Track AddPaymentInfo quando o modal abre
  useEffect(() => {
    if (open && !hasTrackedPaymentInfo) {
      void trackAddPaymentInfo(amount);
      void metaTrackAddPaymentInfo(amount);
      setHasTrackedPaymentInfo(true);
    }
  }, [open, amount, hasTrackedPaymentInfo]);

  // Criar PIX
  useEffect(() => {
    if (open && !pixData && !loading) {
      createPix(amount);
    }
  }, [open, amount, pixData, loading, createPix]);

  // Track PlaceAnOrder quando o PIX é gerado
  useEffect(() => {
    if (pixData?.transactionId) {
      void trackPlaceAnOrder(amount, pixData.transactionId);
    }
  }, [pixData?.transactionId, amount]);

  useEffect(() => {
    if (pixData && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, pixData.qrCode, {
        width: 240,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    }
  }, [pixData]);

  const handleCopy = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole no seu aplicativo de pagamento",
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-xl font-display font-bold">
            Pagamento via PIX
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Valor */}
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Valor a pagar</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-primary">
              R$ {amount.toFixed(2)}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-center">
              <p className="text-sm text-destructive font-semibold">{error}</p>
              <Button 
                onClick={() => createPix(amount)} 
                variant="outline" 
                size="sm"
                className="mt-3"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Success - PIX Generated */}
          {pixData && !isPaid && (
            <>
              {/* Garantia de Envio */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 text-center">
                <p className="text-xs md:text-sm font-semibold text-green-600 dark:text-green-400 flex items-center justify-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  Envio imediato após confirmação do pagamento
                </p>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <canvas ref={canvasRef} className="block" />
                </div>
                
                <div className="flex items-center gap-2 text-center">
                  <QrCodeIcon className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    Escaneie com seu app de banco
                  </p>
                </div>
              </div>

              {/* Código Copia e Cola - Mais destacado */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-center text-muted-foreground">
                  Ou copie o código PIX:
                </p>
                
                <div className="bg-muted rounded-lg p-3 border-2 border-dashed border-border">
                  <code className="text-xs break-all block text-center font-mono text-foreground/80">
                    {pixData.qrCode}
                  </code>
                </div>

                <Button
                  onClick={handleCopy}
                  size="lg"
                  className="w-full gap-2 font-semibold"
                  variant={copied ? "secondary" : "default"}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      Copiar Código PIX
                    </>
                  )}
                </Button>
              </div>

              {/* Instruções */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground">Como pagar:</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Abra o app do seu banco</li>
                  <li>Escolha pagar com PIX</li>
                  <li>Escaneie o QR Code ou cole o código</li>
                  <li>Confirme o pagamento</li>
                </ol>
              </div>

              {/* Status Verificação */}
              <div className="flex items-center justify-center gap-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">
                  Aguardando pagamento...
                </p>
              </div>
            </>
          )}

          {/* Payment Confirmed */}
          {isPaid && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <p className="text-lg font-bold text-green-500">Pagamento Confirmado!</p>
              <p className="text-sm text-muted-foreground text-center">
                Processando seu pedido...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
