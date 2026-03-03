import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Shield, Truck, Star, CheckCircle, Package, Zap, Lock, BadgeCheck, ArrowLeft, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import caseAdaptadaImage from "@/assets/case-adaptada.jpg";
import { PixPaymentModal } from "@/components/PixPaymentModal";
import PurchaseNotification from "@/components/PurchaseNotification";
import { metaTrackInitiateCheckout } from "@/lib/meta-tracking";

interface CheckoutState {
  selectedColor: string;
  quantity: number;
  discountApplied?: boolean;
  finalPrice?: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutState;

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("free");
  const [addUpsell, setAddUpsell] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    number: "",
    complement: "",
  });
  
  const [showPixModal, setShowPixModal] = useState(false);
  const [promoTimer, setPromoTimer] = useState(600); // 10 minutes

  // Promo countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Meta InitiateCheckout
  useEffect(() => {
    void metaTrackInitiateCheckout(productPrice);
  }, []);

  // Buscar CEP
  const handleCepSearch = async () => {
    if (cep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP com 8 dígitos",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado e tente novamente",
          variant: "destructive",
        });
        return;
      }

      setAddress({
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      });

      toast({
        title: "Endereço encontrado!",
        description: "Preencha os dados restantes",
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const productPrice = state?.finalPrice || 9.90;
  const upsellPrice = 7.90;
  const shippingCost = selectedShipping === "express" ? 4.89 : 0;
  const subtotal = productPrice + (addUpsell ? upsellPrice : 0);
  const total = subtotal + shippingCost;

  const handleFinalizePurchase = () => {
    if (!formData.name || !formData.email || !formData.phone || !cep || !formData.number) {
      toast({
        title: "Preencha todos os campos",
        description: "Precisamos de suas informações para enviar o pedido",
        variant: "destructive",
      });
      return;
    }

    setShowPixModal(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "🎉 Pedido Confirmado!",
      description: "Você receberá o código de rastreio por email e WhatsApp",
    });
    
    navigate("/order-confirmation");
  };

  if (!state?.selectedColor) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <PurchaseNotification />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-sm">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="font-medium">Checkout Seguro</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-muted-foreground">
          <span className="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">1</span>
          <span className="font-medium text-foreground">Dados</span>
          <div className="w-8 h-px bg-border"></div>
          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px] font-bold">2</span>
          <span>Pagamento</span>
          <div className="w-8 h-px bg-border"></div>
          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px] font-bold">3</span>
          <span>Confirmação</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Promo timer */}
            <div className="flex items-center gap-2 text-sm bg-accent/5 border border-accent/20 px-4 py-2.5 rounded-lg">
              <Clock className="h-4 w-4 text-accent animate-pulse" />
              <span>
                Desconto de <span className="font-bold">65%</span> expira em{" "}
                <span className="font-mono font-bold text-accent">{formatTimer(promoTimer)}</span>
              </span>
            </div>

            {/* Personal Data */}
            <Card className="p-5 space-y-4">
              <h2 className="text-lg font-display font-bold flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">1</span>
                Seus Dados
              </h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-sm">Nome Completo *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="email" className="text-sm">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm">WhatsApp *</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Address */}
            <Card className="p-5 space-y-4">
              <h2 className="text-lg font-display font-bold flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">2</span>
                Endereço de Entrega
              </h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cep" className="text-sm">CEP *</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                      maxLength={8}
                    />
                    <Button onClick={handleCepSearch} disabled={isLoadingCep} variant="outline" size="sm">
                      {isLoadingCep ? "..." : "Buscar"}
                    </Button>
                  </div>
                </div>

                {address.street && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <Label htmlFor="street" className="text-sm">Rua</Label>
                        <Input id="street" value={address.street} disabled className="mt-1 bg-muted" />
                      </div>
                      <div>
                        <Label htmlFor="number" className="text-sm">Nº *</Label>
                        <Input
                          id="number"
                          placeholder="123"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="complement" className="text-sm">Complemento</Label>
                      <Input
                        id="complement"
                        placeholder="Apto, Bloco, etc."
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm">Bairro</Label>
                        <Input value={address.neighborhood} disabled className="mt-1 bg-muted" />
                      </div>
                      <div>
                        <Label className="text-sm">Cidade</Label>
                        <Input value={address.city} disabled className="mt-1 bg-muted" />
                      </div>
                      <div>
                        <Label className="text-sm">UF</Label>
                        <Input value={address.state} disabled className="mt-1 bg-muted" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Shipping Options */}
            {address.street && (
              <Card className="p-5 space-y-4">
                <h2 className="text-lg font-display font-bold flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">3</span>
                  Frete
                </h2>
                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-colors ${selectedShipping === 'free' ? 'border-green-500 bg-green-500/5' : 'border-border'}`}>
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="font-medium text-sm">Frete Grátis</p>
                              <p className="text-xs text-muted-foreground">7-10 dias úteis</p>
                            </div>
                          </div>
                          <span className="font-bold text-green-600 text-sm">GRÁTIS</span>
                        </div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-colors ${selectedShipping === 'express' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium text-sm">Expresso</p>
                              <p className="text-xs text-muted-foreground">3-5 dias úteis</p>
                            </div>
                          </div>
                          <span className="font-bold text-sm">R$ 4,89</span>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </Card>
            )}

            {/* Upsell */}
            {address.street && (
              <Card className="p-4 bg-gradient-to-br from-accent/5 to-transparent border-accent/30">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 p-2">
                    <img 
                      src={caseAdaptadaImage} 
                      alt="Case Adaptada" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-[10px] font-bold">
                        OFERTA
                      </span>
                      <span className="text-xs text-muted-foreground line-through">R$ 19,90</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">Case Adaptada</h3>
                    <p className="text-xs text-muted-foreground mb-2">Proteção premium para seu kit</p>
                    <Button
                      onClick={() => setAddUpsell(!addUpsell)}
                      variant={addUpsell ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {addUpsell ? "✓ Adicionado" : "+ Adicionar R$ 7,90"}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-4">
              <Card className="p-5 space-y-4">
                <h2 className="text-lg font-display font-bold">Resumo</h2>
                
                <div className="space-y-2 py-3 border-y border-border text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kit iPhone XR ({state.selectedColor})</span>
                    <span className="font-medium">R$ {productPrice.toFixed(2)}</span>
                  </div>
                  {addUpsell && (
                    <div className="flex justify-between text-green-600">
                      <span>Case Adaptada</span>
                      <span className="font-medium">R$ {upsellPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                      {shippingCost === 0 ? "GRÁTIS" : `R$ ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent">R$ {total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleFinalizePurchase}
                  size="lg"
                  className="w-full font-display font-bold py-6 bg-green-500 hover:bg-green-600"
                >
                  FINALIZAR COMPRA
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-green-600" />
                    <span>Seguro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-blue-600" />
                    <span>Garantia</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3 text-accent" />
                    <span>Rastreio</span>
                  </div>
                </div>
              </Card>

              {/* Trust badges */}
              <Card className="p-4 bg-secondary/50 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Garantias do seu pedido:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span>Envio no mesmo dia</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span>Rastreio por WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span>30 dias de garantia</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span>Devolução grátis</span>
                  </div>
                </div>
              </Card>

              {/* Social proof */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex -space-x-2">
                  {['M', 'J', 'A', 'C'].map((letter, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-bold">
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">+543 clientes satisfeitos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PixPaymentModal
        open={showPixModal}
        onClose={() => setShowPixModal(false)}
        amount={total}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Checkout;
