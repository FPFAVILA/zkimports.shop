// TikTok Tracking utilities for frontend events
// Uses event_id for deduplication with server-side events

export interface TikTokEventParams {
  event_type: string;
  event_id?: string;
  event_time?: number;
  value?: number;
  currency?: string;
  content_id?: string;
  content_name?: string;
  content_type?: string;
  quantity?: number;
  order_id?: string;
  email?: string;
  phone?: string;
  external_id?: string;
}

// Gerar ID único para evento (usado para deduplicação)
export const generateEventId = (prefix: string = 'evt'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Enviar evento via API server-side (para eventos de conversão importantes)
export const sendTikTokServerEvent = async (params: TikTokEventParams): Promise<void> => {
  try {
    const response = await fetch('/api/tiktok-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // keepalive ajuda o request não ser cancelado em navegação
      keepalive: true,
      body: JSON.stringify({
        ...params,
        url: window.location.href,
        user_agent: navigator.userAgent,
        // Tentar capturar ttclid da URL (parâmetro de click do TikTok)
        ttclid: new URLSearchParams(window.location.search).get('ttclid') || undefined,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send TikTok server event:', await response.text());
    }
  } catch (error) {
    console.error('Error sending TikTok server event:', error);
  }
};

export const trackViewContent = async (): Promise<string> => {
  const eventId = generateEventId('vc');

  await sendTikTokServerEvent({
    event_type: 'ViewContent',
    event_id: eventId,
    currency: 'BRL',
    content_id: 'kit-transformacao-iphone',
    content_name: 'Kit Transformação iPhone',
    content_type: 'product',
  });

  return eventId;
};

// Enviar evento InitiateCheckout quando o usuário vai para o checkout
export const trackInitiateCheckout = async (value: number, contentName: string): Promise<string> => {
  const eventId = generateEventId('ic');

  await sendTikTokServerEvent({
    event_type: 'InitiateCheckout',
    event_id: eventId,
    value,
    currency: 'BRL',
    content_id: 'kit-transformacao-iphone',
    content_name: contentName,
    content_type: 'product',
    quantity: 1,
  });

  return eventId;
};

// Enviar evento AddPaymentInfo quando o usuário abre o modal de pagamento
export const trackAddPaymentInfo = async (value: number): Promise<string> => {
  const eventId = generateEventId('api');

  await sendTikTokServerEvent({
    event_type: 'AddPaymentInfo',
    event_id: eventId,
    value,
    currency: 'BRL',
    content_id: 'kit-transformacao-iphone',
    content_name: 'Kit Transformação iPhone',
    content_type: 'product',
    quantity: 1,
  });

  return eventId;
};

// Enviar evento PlaceAnOrder quando o PIX é gerado
export const trackPlaceAnOrder = async (value: number, transactionId: string): Promise<string> => {
  // Usar o transactionId como event_id para facilitar deduplicação/diagnóstico
  const eventId = transactionId || generateEventId('pao');

  await sendTikTokServerEvent({
    event_type: 'PlaceAnOrder',
    event_id: eventId,
    value,
    currency: 'BRL',
    content_id: 'kit-transformacao-iphone',
    content_name: 'Kit Transformação iPhone',
    content_type: 'product',
    quantity: 1,
    order_id: transactionId,
  });

  return eventId;
};
