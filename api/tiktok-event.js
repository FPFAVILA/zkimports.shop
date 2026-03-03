import crypto from 'crypto';

const pixelCode = process.env.TIKTOK_PIXEL_ID || process.env.TIKTOK_PIXEL_CODE || 'D59DNNRC77U4D2G7UUE0';

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

// Hash dos dados do usuário para privacidade (SHA256)
const hashData = (data) => {
  if (!data) return undefined;
  return crypto
    .createHash('sha256')
    .update(data.toString().toLowerCase().trim())
    .digest('hex');
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('TIKTOK_ACCESS_TOKEN not configured');
      return res.status(500).json({ error: 'TikTok access token not configured' });
    }

    const {
      event_type,
      event_id,
      event_time,
      value,
      currency = 'BRL',
      content_id,
      content_name,
      content_type = 'product',
      quantity,
      order_id,
      email,
      phone,
      external_id,
      user_agent,
      url,
      ttclid,
    } = req.body || {};

    if (!event_type) {
      return res.status(400).json({ error: 'event_type is required' });
    }

    // event_id para deduplicação
    const finalEventId = event_id || crypto.randomUUID();

    // TikTok Events API v1.3 usa event_time (unix seconds)
    const finalEventTime = Number.isFinite(Number(event_time))
      ? Number(event_time)
      : Math.floor(Date.now() / 1000);

    const ip = getRequestIp(req);
    const ua = req.headers['user-agent'] || user_agent;

    // Montar objeto do usuário (TikTok recomenda ip + user_agent + ttclid)
    const user = {};
    if (email) user.email = hashData(email);
    if (phone) user.phone = hashData(phone.replace(/\D/g, ''));
    if (external_id) user.external_id = hashData(external_id);
    if (ip) user.ip = ip;
    if (ua) user.user_agent = ua;
    if (ttclid) user.ttclid = ttclid;

    const numericValue = value === 0 || value ? Number(value) : undefined;
    const numericQty = quantity ? Number(quantity) : 1;

    const properties = {
      currency,
      value: numericValue,
      content_type,
      content_id,
      content_name,
      order_id,
      contents: content_id ? [
        {
          content_id,
          content_type,
          content_name,
          price: numericValue,
          quantity: numericQty,
        },
      ] : undefined,
    };

    const dataItem = {
      event: event_type,
      event_time: finalEventTime,
      event_id: finalEventId,
      user,
      page: url ? { url } : undefined,
      properties,
    };

    const payload = {
      event_source: 'web',
      event_source_id: pixelCode,
      data: [dataItem],
    };

    console.log('Sending TikTok event:', JSON.stringify(payload, null, 2));

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
      return res.status(response.status || 500).json({
        error: 'TikTok API error',
        details: result,
      });
    }

    console.log('TikTok event sent successfully:', result);

    return res.status(200).json({
      success: true,
      event_id: finalEventId,
      tiktok_response: result,
    });
  } catch (error) {
    console.error('Error sending TikTok event:', error);
    return res.status(500).json({
      error: 'Failed to send TikTok event',
      details: error.message,
    });
  }
}
