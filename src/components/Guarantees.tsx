import { Shield, Truck, CreditCard, Clock } from "lucide-react";

const Guarantees = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "Garantia de 30 dias",
      description: "Produto com defeito? Trocamos ou devolvemos seu dinheiro",
    },
    {
      icon: Truck,
      title: "Frete Grátis",
      description: "Para todo o Brasil até o final da semana",
    },
    {
      icon: CreditCard,
      title: "Pagamento Seguro",
      description: "Seus dados protegidos em todas as transações",
    },
    {
      icon: Clock,
      title: "Entrega Rápida",
      description: "Receba em até 7 dias úteis",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-center mb-8 md:mb-12 animate-fade-in">
          Compre com Total Segurança
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="text-center space-y-3 md:space-y-4 animate-fade-in p-4 md:p-6 bg-card rounded-xl hover:shadow-lg transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <guarantee.icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-sm md:text-lg">{guarantee.title}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{guarantee.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Guarantees;
