// Creates a Stripe Checkout Session for a MoltAgent tier.
// Requires STRIPE_SECRET_KEY plus one price ID env per tier:
// STRIPE_PRICE_DEVELOPER, STRIPE_PRICE_SWARM_PRO, STRIPE_PRICE_ENTERPRISE_SWARM.
// Returns 501 with a clear message until those are configured.
const TIER_ENV = {
  developer: 'STRIPE_PRICE_DEVELOPER',
  'swarm-pro': 'STRIPE_PRICE_SWARM_PRO',
  'enterprise-swarm': 'STRIPE_PRICE_ENTERPRISE_SWARM'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST only' });
  }

  const { tier } = req.body || {};
  const envKey = TIER_ENV[tier];
  if (!envKey) {
    return res.status(400).json({ success: false, message: `Unknown tier: ${tier}` });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[envKey];

  if (!secretKey || !priceId) {
    return res.status(501).json({
      success: false,
      error: 'NOT_CONFIGURED',
      message: `Billing not live yet. Set STRIPE_SECRET_KEY and ${envKey} in Vercel env.`
    });
  }

  try {
    const body = new URLSearchParams({
      mode: 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      success_url: 'https://www.moltagent.run/?checkout=success',
      cancel_url: 'https://www.moltagent.run/?checkout=cancelled'
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const session = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: session.error?.message || 'Stripe error'
      });
    }

    return res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    return res.status(502).json({ success: false, message: `Checkout error: ${err.message}` });
  }
}
