import { Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-display font-bold">ZK Imports</h2>
            <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed">
              Transforme seu iPhone com qualidade e estilo
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h3 className="text-base md:text-lg font-semibold">Links Úteis</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <a href="#inicio" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#reviews" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Avaliações
                </a>
              </li>
              <li>
                <a href="#contato" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h3 className="text-base md:text-lg font-semibold">Redes Sociais</h3>
            <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/zkimportsofc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a
                href="#"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a
                href="#"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-xs text-primary-foreground/60">
            © 2024 ZK Imports. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
