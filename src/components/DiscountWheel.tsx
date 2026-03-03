import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, PartyPopper, Star, Clock, X } from "lucide-react";

interface DiscountWheelProps {
  onDiscountApplied: (discount: number) => void;
  onClose: () => void;
}

const SEGMENTS = [
  { label: "10%", value: 10, color: "hsl(0, 0%, 15%)" },
  { label: "20%", value: 20, color: "hsl(0, 0%, 22%)" },
  { label: "15%", value: 15, color: "hsl(0, 0%, 18%)" },
  { label: "65%", value: 65, color: "hsl(0, 72%, 45%)" },
  { label: "5%", value: 5, color: "hsl(0, 0%, 25%)" },
  { label: "30%", value: 30, color: "hsl(0, 0%, 20%)" },
  { label: "8%", value: 8, color: "hsl(0, 0%, 23%)" },
  { label: "25%", value: 25, color: "hsl(0, 0%, 17%)" },
];

const WINNING_INDEX = 3;

const DiscountWheel = ({ onDiscountApplied, onClose }: DiscountWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [promoTimer, setPromoTimer] = useState(180);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const segmentAngle = 360 / SEGMENTS.length;
    const baseRotation = 360 * 8;
    const targetAngle = WINNING_INDEX * segmentAngle + segmentAngle / 2;
    const finalRotation = baseRotation + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasWon(true);
      setShowConfetti(true);

      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      const timerInterval = setInterval(() => {
        setPromoTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 5200);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const applyDiscount = () => {
    onDiscountApplied(65);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      {/* Close button */}
      {!isSpinning && !hasWon && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white/40 hover:text-white/80 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2.5 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{
                  backgroundColor: ['#dc2626', '#f59e0b', '#22c55e', '#ffffff', '#ef4444', '#eab308'][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="relative w-full max-w-sm mx-4 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-5 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5">
            <Gift className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-xs uppercase tracking-wider">
              Oferta Exclusiva
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
            {hasWon ? "🎉 Parabéns!" : "Gire e Ganhe!"}
          </h2>
          {!hasWon && (
            <p className="text-white/50 text-sm">
              Tente a sorte e ganhe um desconto especial
            </p>
          )}
        </div>

        {/* Wheel */}
        <div className="relative mb-5">
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]" />
          </div>

          {/* Outer glow */}
          <div className="absolute inset-[-8px] rounded-full bg-gradient-to-b from-yellow-400/15 to-accent/10 blur-xl" />

          {/* Wheel SVG */}
          <div
            ref={wheelRef}
            className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full shadow-2xl overflow-hidden border-[3px] border-yellow-400/20 animate-wheel-glow"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 5s cubic-bezier(0.15, 0.60, 0.08, 1.0)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SEGMENTS.map((segment, i) => {
                const angle = 360 / SEGMENTS.length;
                const startAngle = i * angle - 90;
                const endAngle = startAngle + angle;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);

                const largeArc = angle > 180 ? 1 : 0;
                const pathD = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

                const midAngle = startAngle + angle / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textX = 50 + 33 * Math.cos(midRad);
                const textY = 50 + 33 * Math.sin(midRad);

                const isWinner = i === WINNING_INDEX;

                return (
                  <g key={i}>
                    <path d={pathD} fill={segment.color} stroke="hsl(0, 0%, 10%)" strokeWidth="0.3" />
                    {isWinner && (
                      <path d={pathD} fill="none" stroke="hsl(45, 100%, 50%)" strokeWidth="0.6" opacity="0.5" />
                    )}
                    <text
                      x={textX}
                      y={textY}
                      fill={isWinner ? "hsl(45, 100%, 65%)" : "white"}
                      fontSize={isWinner ? "7" : "5"}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                      className="font-display"
                      style={{ textShadow: isWinner ? '0 0 8px rgba(234,179,8,0.5)' : 'none' }}
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
              {/* Center */}
              <circle cx="50" cy="50" r="9" fill="hsl(0, 0%, 6%)" stroke="hsl(45, 100%, 45%)" strokeWidth="0.4" />
              <circle cx="50" cy="50" r="4.5" fill="hsl(0, 72%, 40%)" />
            </svg>
          </div>

          {/* Light dots around wheel */}
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: `${50 + 49 * Math.cos((i * 22.5 * Math.PI) / 180)}%`,
                  top: `${50 + 49 * Math.sin((i * 22.5 * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: i % 2 === 0 ? 'hsl(45, 100%, 50%)' : 'hsl(0, 72%, 50%)',
                  animation: `pulse 1s ease-in-out ${i * 0.06}s infinite`,
                  opacity: isSpinning ? 1 : 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Win Display */}
        {hasWon && (
          <div className="text-center mb-4 animate-scale-in">
            <div className="flex items-center justify-center gap-3 mb-2">
              <PartyPopper className="h-7 w-7 text-yellow-400 animate-bounce" />
              <div className="text-center">
                <span className="text-4xl md:text-5xl font-display font-black text-yellow-400 drop-shadow-lg block">
                  65% OFF
                </span>
                <span className="text-xs text-white/60">
                  De <span className="line-through">R$ 29,90</span> por apenas <span className="text-yellow-400 font-bold">R$ 9,90</span>
                </span>
              </div>
              <PartyPopper className="h-7 w-7 text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>

            {/* Urgency Timer */}
            <div className="mt-3 bg-red-500/15 border border-red-500/30 rounded-lg px-4 py-2 inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-red-400 animate-pulse" />
              <span className="text-red-400 font-mono font-bold text-xs">
                Expira em {formatTimer(promoTimer)}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!hasWon ? (
          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            size="lg"
            className="w-full max-w-[280px] bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-display font-bold text-base py-6 shadow-lg shadow-yellow-500/20 hover:shadow-xl transition-all hover:scale-[1.03] disabled:opacity-70 disabled:hover:scale-100 border-0"
          >
            {isSpinning ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-spin" />
                Girando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                GIRAR ROLETA
                <Star className="h-4 w-4" />
              </span>
            )}
          </Button>
        ) : (
          <Button
            onClick={applyDiscount}
            size="lg"
            className="w-full max-w-[280px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-display font-bold text-base py-6 shadow-lg shadow-green-500/20 hover:shadow-xl transition-all hover:scale-[1.03]"
          >
            <span className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              RESGATAR MEU DESCONTO
            </span>
          </Button>
        )}

        <p className="text-white/25 text-[10px] mt-3 text-center">
          Oferta válida apenas para esta sessão
        </p>
      </div>
    </div>
  );
};

export default DiscountWheel;
