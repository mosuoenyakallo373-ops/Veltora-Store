import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (chunk) => chunks.push(chunk));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

export default async function handler(req, res) {
  const buf = await buffer(req);
  const signature = req.headers['x-paystack-signature'];

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(buf)
    .digest('hex');

  if (hash !== signature) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(buf.toString());

  if (event.event === 'charge.success') {
    const { data } = event;
    const items = data.metadata?.items || [];

    await supabase.from('orders').insert({
      customer_name: data.customer?.first_name
        ? `${data.customer.first_name} ${data.customer.last_name || ''}`.trim()
        : '',
      customer_email: data.customer?.email || '',
      items,
      total: data.amount / 100,
      status: 'paid',
    });
  }

  res.status(200).json({ received: true });
    }
      
