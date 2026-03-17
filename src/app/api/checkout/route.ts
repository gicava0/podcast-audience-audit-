import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// This grabs your Stripe Secret Key from Vercel's secure vault (we will add it there next)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rss_url, email } = body;

    if (!rss_url || !email) {
      return NextResponse.json({ error: 'Missing rss_url or email' }, { status: 400 });
    }

    // 🛑 Creates the Stripe Checkout Page
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Podcast Audience Audit',
              description: 'Deep-dive AI strategy report for your podcast.',
            },
            unit_amount: 4900, // This is $49.00. Change this number to whatever you want!
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // 🛑 THIS IS THE MAGIC TRICK: We attach the podcast info to the payment so we don't lose it!
      metadata: {
        rss_url: rss_url,
        email: email,
      },
      // Where to send them after they pay (or if they click back)
      success_url: `${request.headers.get('origin')}/?success=true`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}