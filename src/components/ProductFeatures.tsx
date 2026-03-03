import { Check } from "lucide-react";

const ProductFeatures = () => {
  const features = [
    "Película adesiva de alta qualidade",
    "Transforma visual do iPhone XR em 13 Pro Max",
    "Fácil instalação - não precisa de experiência",
    "Material resistente a arranhões",
    "Não interfere em câmeras ou funções",
    "Acabamento premium e realista",
    "Disponível em 3 cores: Branco, Preto e Vermelho",
    "Proteção extra para a traseira do aparelho",
  ];

  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-center mb-8 md:mb-12 animate-fade-in">
            Por Que Escolher Nosso Kit?
          </h2>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 md:p-4 bg-card rounded-lg border border-border hover:border-accent/30 hover:shadow-md transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                  <Check className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                </div>
                <p className="text-foreground text-sm md:text-base leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;
