import { Truck, ShieldCheck, Zap } from "lucide-react";

const PromoBanner = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 md:gap-6 text-xs md:text-sm">
          {/* Flash sale */}
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-yellow-400" />
            <span className="font-bold text-yellow-400">PROMOÇÃO ATIVA</span>
          </div>

          <span className="text-primary-foreground/30">|</span>

          {/* Free shipping */}
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-green-400" />
            <span className="font-medium">Frete Grátis</span>
          </div>

          <span className="hidden md:inline text-primary-foreground/30">|</span>

          {/* Secure */}
          <div className="hidden md:flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-medium">Compra Segura</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
