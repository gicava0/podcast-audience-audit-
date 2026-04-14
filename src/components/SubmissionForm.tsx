'use client';

import { useState } from 'react';

export function SubmissionForm() {
  const [email, setEmail] = useState('');
  const [rssFeed, setRssFeed] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState(''); // 👈 NEW STATE
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('Redirecting to secure checkout...');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 👈 NEW: Pass websiteUrl to the backend
        body: JSON.stringify({ rss_url: rssFeed, email: email, website_url: websiteUrl }),
      });

      if (!response.ok) throw new Error('Something went wrong with the checkout.');
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Could not generate checkout link.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to submit. Try again.');
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="url"
          name="rssFeed"
          value={rssFeed}
          onChange={(e) => setRssFeed(e.target.value)}
          placeholder="Enter Podcast RSS Feed URL"
          required
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-cyan-400"
        />
        {/* 👈 NEW INPUT FIELD */}
        <input
          type="url"
          name="websiteUrl"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="Website or Social Link (Optional but recommended)"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-cyan-400"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email Address"
          required
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-cyan-400"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !rssFeed || !email}
          className="w-full rounded-lg bg-cyan-400 px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-cyan-300 disabled:opacity-50"
        >
          {status === 'loading' ? 'Redirecting…' : 'Start Your Audit'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center text-sm ${status === 'error' ? 'text-red-400' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}