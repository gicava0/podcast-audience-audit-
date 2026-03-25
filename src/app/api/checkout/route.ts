import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// This grabs your Stripe Secret Key from Vercel's secure vault
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover',
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
          price: 'price_1TBnDhS1DFd0SSg1mH2Ala6U',
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
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