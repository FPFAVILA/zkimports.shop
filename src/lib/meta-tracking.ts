// Meta/Facebook Tracking utilities for frontend events
// Uses event_id for deduplication between Pixel (client) and CAPI (server)

import { generateEventId } from './tiktok-tracking';

const META_PIXEL_ID = '1640408513612756';

// Capturar cookies _fbp e _fbc para melhor match rate
const getFbCookies = () => {
  const cookies = document.cookie.split(';').reduce((acc, c) => {
    const [key, val] = c.trim().split('=');
    if (key && val) acc[key] = val;
    return acc;
  }, {} as Record<string, string>);

  return {
    fbp: cookies['_fbp'] || undefined,
    fbc: cookies['_fbc'] || new URLSearchParams(window.location.search).get('fbclid')
      ? `fb.1.${Date.now()}.${new URLSearchParams(window.location.search).get('fbclid')}`
      : undefined,
  };
};

// Enviar evento via Pixel client-side (fbq)
const sendPixelEvent = (eventName: string, params?: Record<string, unknown>, eventId?: string) => {
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (w.fbq) {
    if (eventId) {
      w.fbq('track', eventName, params || {}, { eventID: eventId });
    } else {
      w.fbq('track', eventName, params || {});
    }
  }
};

// Enviar evento via CAPI server-side
const sendServerEvent = async (params: {
  event_name: string;
  event_id: string;
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  order_id?: string;
}) => {
  try {
    const { fbp, fbc } = getFbCookies();
    await fetch('/api/meta-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        ...params,
        pixel_id: META_PIXEL_ID,
        url: window.location.href,
        user_agent: navigator.userAgent,
        fbp,
        fbc,
      }),
    });
  } catch (err) {
    console.error('Meta CAPI error:', err);
  }
};

// === Eventos ===

export const metaTrackPageView = () => {
  const eventId = generateEventId('mpv');
  sendPixelEvent('PageView', undefined, eventId);
  // PageView server-side não é necessário (o pixel já cobre bem)
};

export const metaTrackViewContent = async () => {
  const eventId = generateEventId('mvc');
  const params = {
    content_ids: ['kit-transformacao-iphone'],
    content_name: 'Kit Transformação iPhone',
    content_type: 'product',
    currency: 'BRL',
    value: 29.90,
  };
  sendPixelEvent('ViewContent', params, eventId);
  await sendServerEvent({ event_name: 'ViewContent', event_id: eventId, ...params });
};

export const metaTrackInitiateCheckout = async (value: number) => {
  const eventId = generateEventId('mic');
  const params = {
    content_ids: ['kit-transformacao-iphone'],
    content_name: 'Kit Transformação iPhone',
    content_type: 'product',
    currency: 'BRL',
    value,
    num_items: 1,
  };
  sendPixelEvent('InitiateCheckout', params, eventId);
  await sendServerEvent({ event_name: 'InitiateCheckout', event_id: eventId, value, currency: 'BRL', content_ids: ['kit-transformacao-iphone'], content_name: 'Kit Transformação iPhone', content_type: 'product' });
};

export const metaTrackAddPaymentInfo = async (value: number) => {
  const eventId = generateEventId('mapi');
  const params = { currency: 'BRL', value };
  sendPixelEvent('AddPaymentInfo', params, eventId);
  await sendServerEvent({ event_name: 'AddPaymentInfo', event_id: eventId, value, currency: 'BRL' });
};
