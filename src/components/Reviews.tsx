import { Star, BadgeCheck } from "lucide-react";

import review1 from "@/assets/reviews/review-1.jpg";
import review2 from "@/assets/reviews/review-2.jpg";
import review3 from "@/assets/reviews/review-3.jpg";
import review4 from "@/assets/reviews/review-4.jpg";
import review5 from "@/assets/reviews/review-5.jpg";
import review6 from "@/assets/reviews/review-6.jpg";

const Reviews = () => {
  const reviews = [
    {
      name: "Maria Silva",
      location: "São Paulo, SP",
      rating: 5,
      comment: "Produto incrível! Meu iPhone XR ficou com aparência de 13 Pro Max. Super recomendo!",
      image: review1,
      verified: true,
    },
    {
      name: "João Pedro",
      location: "Rio de Janeiro, RJ",
      rating: 5,
      comment: "Chegou rápido e a qualidade surpreendeu. Parece original!",
      image: review2,
      verified: true,
    },
    {
      name: "Ana Carolina",
      location: "Belo Horizonte, MG",
      rating: 5,
      comment: "Transformou completamente meu celular. Vale muito a pena pelo preço!",
      image: review3,
      verified: true,
    },
    {
      name: "Karla Lorraine",
      location: "Curitiba, PR",
      rating: 5,
      comment: "Instalação super fácil! Em 5 minutos meu iPhone XR estava com cara de novo.",
      image: review4,
      verified: true,
    },
    {
      name: "Fernanda Costa",
      location: "Salvador, BA",
      rating: 5,
      comment: "Amei! A película é de excelente qualidade e não sai. Meu iPhone ficou perfeito!",
      image: review5,
      verified: true,
    },
    {
      name: "Lucas Almeida",
      location: "Brasília, DF",
      rating: 5,
      comment: "Melhor compra que fiz! Todo mundo pergunta se meu celular é novo.",
      image: review6,
      verified: true,
    },
  ];

  return (
    <section id="reviews" className="py-10 md:py-14 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <BadgeCheck className="h-3.5 w-3.5" />
            <span>AVALIAÇÕES VERIFICADAS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 md:h-6 md:w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-base md:text-lg font-bold">4.9/5.0</span>
            <span className="text-xs md:text-sm text-muted-foreground">(543 avaliações)</span>
          </div>
        </div>

        {/* Mobile: horizontal scroll | Desktop: grid */}
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0">
            {reviews.map((review, index) => (
              <article
                key={index}
                className="bg-card border border-border rounded-xl p-4 space-y-3 animate-fade-in snap-start min-w-[280px] md:min-w-0 hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Review Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-bold text-primary">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm truncate">{review.name}</p>
                        {review.verified && (
                          <BadgeCheck className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{review.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-sm text-foreground leading-relaxed">
                  "{review.comment}"
                </p>

                {/* Customer Photo */}
                {review.image && (
                  <div className="rounded-lg overflow-hidden bg-secondary/30">
                    <img
                      src={review.image}
                      alt={`Avaliação do kit iPhone XR - ${review.name}`}
                      className="w-full h-48 md:h-56 object-cover object-[center_20%]"
                      loading="lazy"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Trust indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            +543 clientes satisfeitos em todo o Brasil 🇧🇷
          </p>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
