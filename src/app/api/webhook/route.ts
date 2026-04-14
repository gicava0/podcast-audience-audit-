import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover',
});

// We will add this secret to Vercel in the next step!
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) throw new Error('Missing Stripe signature or webhook secret.');
    // This verifies the request actually came from Stripe and not a hacker
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 🛑 If the payment was successful...
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Pull the podcast details out of the payment metadata
    const rss_url = session.metadata?.rss_url;
    const email = session.metadata?.email;
    const website_url = session.metadata?.website_url;

    console.log(`✅ Payment cleared for ${email}. Triggering Google Cloud!`);

    if (rss_url && email) {
      // Trigger your existing Google Cloud AI pipeline!
      try {
        await fetch('https://australia-southeast1-podcasttranscriber-460408.cloudfunctions.net/rss-to-transcribe-fn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rss_url, email, website_url }),
        });
      } catch (triggerError) {
        console.error('Failed to trigger Google Cloud:', triggerError);
      }
    }
  }

  return NextResponse.json({ received: true });
}