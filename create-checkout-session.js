export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, email } = req.body;

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const amountInCents = Math.round(total * 100);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInCents,
        currency: 'ZAR',
        callback_url: `${req.headers.origin}/?success=true`,
        metadata: { items },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({ error: data.message });
    }

    res.status(200).json({ url: data.data.authorization_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
        }
        
