import { useState, useCallback, useEffect, useRef } from "react";

interface PixData {
  qrCode: string;
  qrCodeBase64: string;
  amount: number;
  transactionId: string;
}

interface UsePix {
  createPix: (amount: number) => Promise<void>;
  checkPixStatus: (transactionId: string) => Promise<string>;
  reset: () => void;
  loading: boolean;
  error: string | null;
  pixData: PixData | null;
  isPaid: boolean;
}

export const usePix = (onPaymentConfirmed?: () => void): UsePix => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasConfirmedRef = useRef(false);
  const isCheckingRef = useRef(false);

  // Limpar polling ao desmontar
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const checkPixStatus = useCallback(async (transactionId: string): Promise<string> => {
    try {
      const response = await fetch(`/api/check-pix?id=${transactionId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status do pagamento');
      }

      const data = await response.json();
      return data.status;
    } catch (err) {
      console.error('Error checking PIX status:', err);
      return 'error';
    }
  }, []);

  const startPolling = useCallback((transactionId: string) => {
    // Limpar polling anterior se existir
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    hasConfirmedRef.current = false;
    isCheckingRef.current = false;

    // Polling a cada 3 segundos (com proteção contra requests simultâneas)
    pollingIntervalRef.current = setInterval(async () => {
      if (hasConfirmedRef.current || isCheckingRef.current) return;

      isCheckingRef.current = true;
      try {
        const status = await checkPixStatus(transactionId);

        if (status === "paid") {
          hasConfirmedRef.current = true;
          setIsPaid(true);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          onPaymentConfirmed?.();
          return;
        }

        if (status === "expired" || status === "cancelled") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setError("Pagamento expirado ou cancelado");
        }
      } finally {
        isCheckingRef.current = false;
      }
    }, 3000);
  }, [checkPixStatus, onPaymentConfirmed]);

  const createPix = useCallback(async (amount: number) => {
    setLoading(true);
    setError(null);
    setIsPaid(false);
    hasConfirmedRef.current = false;
    isCheckingRef.current = false;

    try {
      if (amount < 0.01) {
        throw new Error("Valor mínimo é R$ 0,01");
      }

      const response = await fetch("/api/create-pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar PIX");
      }

      const data = await response.json();

      const pixDataResult: PixData = {
        qrCode: data.qr_code,
        qrCodeBase64: data.qr_code_base64,
        amount: data.value / 100, // Converter de centavos para reais
        transactionId: data.id,
      };

      setPixData(pixDataResult);

      // Iniciar polling para verificar pagamento
      startPolling(data.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao gerar PIX";
      setError(errorMessage);
      console.error("Error creating PIX:", err);
    } finally {
      setLoading(false);
    }
  }, [startPolling]);

  const reset = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    hasConfirmedRef.current = false;
    isCheckingRef.current = false;
    setPixData(null);
    setError(null);
    setIsPaid(false);
    setLoading(false);
  }, []);

  return {
    createPix,
    checkPixStatus,
    reset,
    loading,
    error,
    pixData,
    isPaid,
  };
};
