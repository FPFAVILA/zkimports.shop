// Webhook PushinPay -> envia evento Purchase para TikTok Events API + Meta CAPI
import crypto from 'crypto';

const pixelCode = process.env.TIKTOK_PIXEL_ID || process.env.TIKTOK_PIXEL_CODE || 'D59DNNRC77U4D2G7UUE0';
const META_PIXEL_ID = '1640408513612756';

const hashData = (data) => {
  if (!data) return undefined;
  return crypto.createHash('sha256').update(data.toString().toLowerCase().trim()).digest('hex');
};

const getRequestIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string' && xForwardedFor.length) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = req.headers['x-real-ip'];
  if (typeof xRealIp === 'string' && xRealIp.length) {
    return xRealIp.trim();
  }

  return req.socket?.remoteAddress;
};

// Função para enviar evento de Purchase ao TikTok
async function sendTikTokPurchaseEvent(transactionData, req) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('TIKTOK_ACCESS_TOKEN not configured, skipping TikTok event');
    return null;
  }

  try {
    // Usar o ID da transação como event_id para facilitar deduplicação
    const eventId = String(transactionData.id);

    // Valor em reais (converter de centavos)
    const valueInReais = transactionData.value / 100;

    const ip = getRequestIp(req);
    const userAgent = req.headers['user-agent'];
    const url =
      (typeof req.headers.origin === 'string' && req.headers.origin) ||
      (typeof req.headers.referer === 'string' && req.headers.referer) ||
      (req.headers.host ? `https://${req.headers.host}` : 'https://zkimports.com.br');

    // TikTok Events API v1.3 espera: event_source + event_source_id + data[]
    const payload = {
      event_source: 'web',
      event_source_id: pixelCode,
      data: [
        {
          event: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          user: {
            ip,
            user_agent: userAgent,
          },
          page: { url },
          properties: {
            value: valueInReais,
            currency: 'BRL',
            content_type: 'product',
            content_id: 'kit-transformacao-iphone',
            content_name: 'Kit Transformação iPhone',
            order_id: eventId,
            contents: [
              {
                content_id: 'kit-transformacao-iphone',
                content_type: 'product',
                content_name: 'Kit Transformação iPhone',
                price: valueInReais,
                quantity: 1,
              },
            ],
          },
        },
      ],
    };

    console.log('Sending TikTok Purchase event:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.code !== 0) {
      console.error('TikTok API Error:', result);
      return { error: result };
    }

    console.log('TikTok Purchase event sent successfully:', result);
    return { success: true, event_id: eventId, result };
  } catch (error) {
    console.error('Error sending TikTok Purchase event:', error);
    return { error: error.message };
  }
}

// Função para enviar evento de Purchase à Meta CAPI
async function sendMetaPurchaseEvent(transactionData, req) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn('META_ACCESS_TOKEN not configured, skipping Meta event');
    return null;
  }

  try {
    const eventId = String(transactionData.id);
    const valueInReais = transactionData.value / 100;
    const ip = getRequestIp(req);
    const userAgent = req.headers['user-agent'];
    const url = req.headers.origin || req.headers.referer || 'https://zkimports.com.br';

    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: url,
        user_data: {
          client_ip_address: ip,
          client_user_agent: userAgent,
        },
        custom_data: {
          value: valueInReais,
          currency: 'BRL',
          content_type: 'product',
          content_ids: ['kit-transformacao-iphone'],
          content_name: 'Kit Transformação iPhone',
          order_id: eventId,
        },
      }],
    };

    console.log('Sending Meta Purchase event:', JSON.stringify(payload, null, 2));

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json().catch(() => null);
    if (!response.ok) {
      console.error('Meta CAPI Error:', result);
      return { error: result };
    }

    console.log('Meta Purchase event sent successfully:', result);
    return { success: true, event_id: eventId, result };
  } catch (error) {
    console.error('Error sending Meta Purchase event:', error);
    return { error: error.message };
  }
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, x-pushinpay-token')
      .end();
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-pushinpay-token');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log do body completo para debug
    console.log('Webhook raw body:', JSON.stringify(req.body, null, 2));

    // PushinPay pode enviar dados diretamente ou dentro de um objeto
    const body = req.body || {};
    
    // Tentar extrair dados de diferentes estruturas possíveis
    const transactionData = body.data || body.transaction || body;
    
    const id = transactionData.id || transactionData.transaction_id || body.id;
    const status = transactionData.status || body.status;
    const value = transactionData.value || transactionData.amount || body.value || body.amount;
    const created_at = transactionData.created_at || body.created_at;
    const updated_at = transactionData.updated_at || body.updated_at;

    // Logar dados extraídos
    console.log('Webhook parsed data:', {
      id,
      status,
      value,
      valueInReais: value ? value / 100 : 'N/A',
      created_at,
      updated_at,
    });

    // Verificar se temos os dados necessários
    if (!id || !status) {
      console.warn('Missing required fields: id or status');
      return res.status(200).json({ received: true, warning: 'Missing id or status' });
    }

    // Se o pagamento foi confirmado, enviar evento Purchase para TikTok
    // Aceitar variações: 'paid', 'PAID', 'approved', 'completed', 'confirmed'
    const paidStatuses = ['paid', 'PAID', 'approved', 'APPROVED', 'completed', 'COMPLETED', 'confirmed', 'CONFIRMED'];
    const isPaid = paidStatuses.includes(status);
    
    console.log(`Payment status: "${status}" - isPaid: ${isPaid}`);
    
    let tiktokResult = null;
    let metaResult = null;
    if (isPaid && value) {
      console.log('Payment confirmed! Sending Purchase events...');
      tiktokResult = await sendTikTokPurchaseEvent({ id, value, status }, req);
      metaResult = await sendMetaPurchaseEvent({ id, value, status }, req);
      console.log('TikTok result:', JSON.stringify(tiktokResult, null, 2));
      console.log('Meta result:', JSON.stringify(metaResult, null, 2));
    } else if (!isPaid) {
      console.log(`Status "${status}" is not a paid status, skipping TikTok event`);
    } else if (!value) {
      console.warn('No value found in transaction, skipping TikTok event');
    }

    // Sempre retornar 200 para o webhook
    return res.status(200).json({
      received: true,
      transaction_id: id,
      status: status,
      is_paid: isPaid,
      tiktok_event: tiktokResult,
      meta_event: metaResult,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Retornar 200 mesmo com erro para não causar retry do webhook
    return res.status(200).json({ received: true, error: error.message });
  }
}

