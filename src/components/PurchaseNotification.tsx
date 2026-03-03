import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

const brazilianNames = [
  "Maria", "Ana", "Juliana", "Fernanda", "Camila", "Patricia", "Lucas", "Pedro", 
  "Rafael", "Bruno", "Carlos", "João", "Marcos", "Felipe", "Gabriel", "Thiago",
  "Beatriz", "Amanda", "Larissa", "Carolina", "Renata", "Vanessa", "Letícia"
];

const brazilianCities = [
  "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR",
  "Porto Alegre, RS", "Salvador, BA", "Brasília, DF", "Fortaleza, CE",
  "Recife, PE", "Campinas, SP", "Goiânia, GO", "Manaus, AM", "Florianópolis, SC"
];

const timeAgo = ["agora", "há 1 min", "há 2 min", "há 3 min", "há 5 min"];

const PurchaseNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({
    name: "",
    city: "",
    time: "",
  });

  const generateNotification = () => {
    const randomName = brazilianNames[Math.floor(Math.random() * brazilianNames.length)];
    const randomCity = brazilianCities[Math.floor(Math.random() * brazilianCities.length)];
    const randomTime = timeAgo[Math.floor(Math.random() * timeAgo.length)];
    
    setNotification({
      name: randomName,
      city: randomCity,
      time: randomTime,
    });
  };

  useEffect(() => {
    // Primeira notificação após 8 segundos
    const initialTimeout = setTimeout(() => {
      generateNotification();
      setIsVisible(true);
      
      // Esconder após 4 segundos
      setTimeout(() => setIsVisible(false), 4000);
    }, 8000);

    // Notificações recorrentes a cada 25-40 segundos
    const interval = setInterval(() => {
      generateNotification();
      setIsVisible(true);
      
      // Esconder após 4 segundos
      setTimeout(() => setIsVisible(false), 4000);
    }, 25000 + Math.random() * 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-in-left max-w-[300px]">
      <div className="bg-card border border-border shadow-xl rounded-lg p-3 flex items-start gap-3">
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {notification.name} comprou
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {notification.city}
          </p>
          <p className="text-xs text-accent font-medium">{notification.time}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PurchaseNotification;
