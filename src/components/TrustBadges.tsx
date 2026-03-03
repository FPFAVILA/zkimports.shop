import { ShieldCheck, BadgeCheck, Truck, Lock } from "lucide-react";

const TrustBadges = () => {
  return (
    <section className="py-6 bg-secondary/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
          {/* Verified Badge */}
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <BadgeCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Loja Verificada</span>
              <span className="text-muted-foreground text-[10px] md:text-xs">Shop Partner</span>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500/10 rounded-full">
              <Lock className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Pagamento Seguro</span>
              <span className="text-muted-foreground text-[10px] md:text-xs">SSL Certificado</span>
            </div>
          </div>

          {/* Guaranteed Delivery */}
          <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500/10 rounded-full">
              <Truck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Entrega Garantida</span>
              <span className="text-muted-foreground text-[10px] md:text-xs">Rastreio em tempo real</span>
            </div>
          </div>

          {/* Protection */}
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-full">
              <ShieldCheck className="h-4 w-4 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Compra Protegida</span>
              <span className="text-muted-foreground text-[10px] md:text-xs">30 dias de garantia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
