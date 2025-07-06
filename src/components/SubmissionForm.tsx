// src/components/SubmissionForm.tsx
'use client';

import { useState } from 'react';

export function SubmissionForm() {
  const [email, setEmail] = useState('');
  const [rssFeed, setRssFeed] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    // =======================================================================
    // This is now your live production endpoint.
    const endpoint = 'https://australia-southeast1-podcasttranscriber-460408.cloudfunctions.net/rss_to_transcribe';
    // =======================================================================

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, rss: rssFeed }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setMessage('Success! Your audit is processing. Check your email in a few minutes.');
      setEmail('');
      setRssFeed('');

    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An unexpected error occurred.');
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
          className="w-full rounded-md bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-cyan-400"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email Address"
          required
          className="w-full rounded-md bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-cyan-400"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-lg bg-cyan-400 px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:opacity-50"
        >
          {status === 'loading' ? 'Analyzing...' : 'Get Your Free Audit'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
