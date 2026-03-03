import { ShieldCheck, BadgeCheck } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border/30 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-foreground">
              ZK Imports
            </h1>
            <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              <BadgeCheck className="h-3 w-3" />
              <span className="text-[10px] font-semibold">OFICIAL</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium hidden sm:inline">Compra 100% Segura</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
