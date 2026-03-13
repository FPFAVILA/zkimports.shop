import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Star, Truck, ShieldCheck, Zap, Tag, Sparkles, Package } from "lucide-react";
import productWhite from "@/assets/product-white.jpg";
import productBlack from "@/assets/product-black.jpg";
import productRed from "@/assets/product-red.jpg";
import { trackInitiateCheckout } from "@/lib/tiktok-tracking";

interface ProductHeroProps {
  whatsappNumber?: string;
  discountApplied?: boolean;
}

const ORIGINAL_PRICE = 29.90;
const DISCOUNTED_PRICE = 9.90;

const ProductHero = ({ whatsappNumber = "556294330111", discountApplied = false }: ProductHeroProps) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<"Branco" | "Preto" | "Vermelho">("Branco");
  const [promoTimeLeft, setPromoTimeLeft] = useState(600); // 10 minutes
  const [showPriceAnimation, setShowPriceAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [displayPrice, setDisplayPrice] = useState(ORIGINAL_PRICE);
  

  const colors = [
    { name: "Branco" as const, bgClass: "bg-white border-2 border-border", image: productWhite },
    { name: "Preto" as const, bgClass: "bg-primary", image: productBlack },
    { name: "Vermelho" as const, bgClass: "bg-red-600", image: productRed },
  ];

  const currentImage = colors.find(c => c.name === selectedColor)?.image || productWhite;


  // Promo countdown timer
  useEffect(() => {
    if (!discountApplied) return;
    const interval = setInterval(() => {
      setPromoTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [discountApplied]);


  // Trigger price animation when discount is applied
  useEffect(() => {
    if (discountApplied && !showPriceAnimation) {
      setShowPriceAnimation(true);
      
      setTimeout(() => setAnimationStep(1), 300);
      
      setTimeout(() => {
        setAnimationStep(2);
        const duration = 1500;
        const startTime = Date.now();
        const startPrice = ORIGINAL_PRICE;
        const endPrice = DISCOUNTED_PRICE;
        
        const animatePrice = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentPrice = startPrice - (startPrice - endPrice) * easeOutQuart;
          setDisplayPrice(Number(currentPrice.toFixed(2)));
          
          if (progress < 1) {
            requestAnimationFrame(animatePrice);
          } else {
            setDisplayPrice(DISCOUNTED_PRICE);
            setAnimationStep(3);
          }
        };
        
        requestAnimationFrame(animatePrice);
      }, 800);
    }
  }, [discountApplied, showPriceAnimation]);

  const handleBuyNow = async () => {
    const finalPrice = discountApplied ? DISCOUNTED_PRICE : ORIGINAL_PRICE;
    await trackInitiateCheckout(finalPrice, `Kit Transformação iPhone X XS/XS MAX - ${selectedColor}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/checkout", {
      state: {
        selectedColor,
        quantity: 1,
        discountApplied,
        finalPrice,
      },
    });
  };

  const currentDisplayPrice = discountApplied ? displayPrice : ORIGINAL_PRICE;
  const showDiscount = discountApplied && animationStep >= 1;

  return (
    <section className="container mx-auto px-4 py-6 md:py-10">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
        {/* Product Image Section */}
        <div className="animate-fade-in order-1 relative">
          {/* Promo Badge */}
          {showDiscount && (
            <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg animate-discount-badge">
              <Tag className="h-3.5 w-3.5" />
              <span>-65% DESCONTO</span>
            </div>
          )}
          
          <div className="aspect-square bg-secondary rounded-2xl overflow-hidden shadow-xl">
            <img 
              key={selectedColor}
              src={currentImage} 
              alt={`Kit para transformar iPhone X XS/XS MAX em iPhone 13 Pro Max (${selectedColor})`}
              className="w-full h-full object-cover transition-all duration-500 animate-fade-in"
            />
          </div>

          {/* Mini trust badges under image */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-green-600" />
              <span>Frete Grátis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Garantia 30 dias</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-accent" />
              <span>Envio Hoje</span>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="animate-fade-in space-y-4 order-2">

          <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight">
            Kit para Transformar iPhone X XS/XS MAX no 13 Pro Max
          </h1>

          {/* Rating Stars - Clickable */}
          <a 
            href="#reviews" 
            className="flex items-center gap-2 group cursor-pointer w-fit"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-transform group-hover:scale-110" />
              ))}
            </div>
            <span className="text-sm font-semibold group-hover:text-accent transition-colors">
              4.9/5.0
            </span>
            <span className="text-xs text-muted-foreground group-hover:text-accent/80 transition-colors">
              (543 avaliações verificadas)
            </span>
          </a>

          {/* Price Section */}
          <div className={`bg-secondary/50 p-4 rounded-xl border transition-all duration-500 ${showDiscount ? 'border-accent/50 shadow-lg' : 'border-border'}`}>
            {showDiscount && (
              <div className="flex items-center gap-3 mb-3 animate-fade-in">
                <div className="relative bg-muted px-3 py-1 rounded">
                  <span className="text-lg font-semibold text-muted-foreground">
                    R$ {ORIGINAL_PRICE.toFixed(2).replace('.', ',')}
                  </span>
                  <div 
                    className="absolute top-1/2 left-0 h-[2px] bg-accent animate-price-strike" 
                    style={{ width: animationStep >= 1 ? '100%' : '0%' }}
                  />
                </div>
                {animationStep >= 3 && (
                  <span className="bg-green-500 text-white text-xs px-2.5 py-1 rounded font-bold animate-scale-in">
                    ECONOMIA DE 65%
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-baseline gap-2">
              <span 
                className={`font-display font-bold transition-all duration-300 ${
                  showDiscount 
                    ? 'text-3xl md:text-4xl text-accent animate-price-drop' 
                    : 'text-3xl md:text-4xl text-foreground'
                }`}
              >
                R$ {currentDisplayPrice.toFixed(2).replace('.', ',')}
              </span>
              {animationStep >= 2 && animationStep < 3 && (
                <Sparkles className="h-5 w-5 text-accent animate-spin" />
              )}
            </div>
            
            {showDiscount && animationStep >= 3 && (
              <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Você economiza R$ {(ORIGINAL_PRICE - DISCOUNTED_PRICE).toFixed(2).replace('.', ',')}
              </p>
            )}
            
            {!discountApplied && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Preço especial por tempo limitado
              </p>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Escolha a Cor:</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                    selectedColor === color.name
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-3">
            <Button
              onClick={handleBuyNow}
              size="lg"
              className={`w-full text-base md:text-lg font-display font-bold py-6 transition-all hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2 ${
                discountApplied 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-accent hover:bg-accent/90'
              }`}
            >
              <Zap className="h-5 w-5" />
              {discountApplied ? "GARANTIR MEU DESCONTO" : "COMPRAR AGORA"}
            </Button>
            
            {/* Security note */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5 text-blue-600" />
                <span>Rastreio Garantido</span>
              </div>
            </div>
          </div>

          {/* Promo Timer */}
          {discountApplied && (
            <div className="flex items-center gap-3 bg-accent/5 p-3.5 rounded-xl border border-accent/20">
              <Clock className="h-4 w-4 text-accent flex-shrink-0" />
              <p className="text-sm text-foreground">
                Oferta expira em{" "}
                <span className="font-bold text-accent tabular-nums">
                  {String(Math.floor(promoTimeLeft / 60)).padStart(2, "0")}:{String(promoTimeLeft % 60).padStart(2, "0")}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
