import crypto from 'crypto';

const PIXEL_ID = '1640408513612756';

const hashData = (data) => {
  if (!data) return undefined;
  return crypto
    .createHash('sha256')
    .update(data.toString().toLowerCase().trim())
    .digest('hex');
};

const getRequestIp = (req) => {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
  const xri = req.headers['x-real-ip'];
  if (typeof xri === 'string' && xri.length) return xri.trim();
  return req.socket?.remoteAddress;
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accessToken = process.env.META_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('META_ACCESS_TOKEN not configured');
      return res.status(500).json({ error: 'Meta access token not configured' });
    }

    const {
      event_name, event_id, value, currency = 'BRL',
      content_ids, content_name, content_type = 'product',
      order_id, email, phone, external_id,
      user_agent, url, fbp, fbc, pixel_id,
    } = req.body || {};

    if (!event_name) {
      return res.status(400).json({ error: 'event_name is required' });
    }

    const pixelId = pixel_id || PIXEL_ID;
    const ip = getRequestIp(req);
    const ua = req.headers['user-agent'] || user_agent;

    const userData = {};
    if (email) userData.em = [hashData(email)];
    if (phone) userData.ph = [hashData(phone.replace(/\D/g, ''))];
    if (external_id) userData.external_id = [hashData(external_id)];
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = ua;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const customData = {};
    if (value !== undefined) customData.value = Number(value);
    if (currency) customData.currency = currency;
    if (content_ids) customData.content_ids = content_ids;
    if (content_name) customData.content_name = content_name;
    if (content_type) customData.content_type = content_type;
    if (order_id) customData.order_id = order_id;

    const eventData = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: event_id || crypto.randomUUID(),
      action_source: 'website',
      event_source_url: url,
      user_data: userData,
      custom_data: customData,
    };

    const payload = { data: [eventData] };

    console.log('Sending Meta CAPI event:', JSON.stringify(payload, null, 2));

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('Meta CAPI Error:', result);
      return res.status(response.status || 500).json({ error: 'Meta CAPI error', details: result });
    }

    console.log('Meta CAPI event sent:', result);
    return res.status(200).json({ success: true, event_id: eventData.event_id, meta_response: result });
  } catch (error) {
    console.error('Error sending Meta event:', error);
    return res.status(500).json({ error: 'Failed to send Meta event', details: error.message });
  }
}
