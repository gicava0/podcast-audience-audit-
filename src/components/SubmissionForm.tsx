// // src/components/SubmissionForm.tsx
'use client';

import { useState } from 'react';

export function SubmissionForm() {
  // Using state names from the new component for consistency
  const [email, setEmail] = useState('');
  const [rssFeed, setRssFeed] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const endpoint = 'https://rss-to-transcribe-fn-l22v5x7jnq-as.a.run.app';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // =======================================================================
        // THE CRITICAL FIX: Changed 'rss' to 'rss_url' to match your backend
        body: JSON.stringify({ rss_url: rssFeed, email: email }),
        // =======================================================================
      });

      if (!response.ok) {
        // Use the exact error handling from your old code
        throw new Error('Something went wrong.');
      }

      // Use the success handling from your old code
      setStatus('success');
      setMessage('Submitted! Your job’s started.');
      setRssFeed(''); // Changed from setRss
      setEmail('');

    } catch (error: any) {
      // Use the error handling from your old code
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
          // Using the styles from the previous fix
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
          // Use the 'status' state to disable the button
          disabled={status === 'loading' || !rssFeed || !email}
          className="w-full rounded-lg bg-cyan-400 px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:opacity-50"
        >
          {/* Use the 'status' state for the button text */}
          {status === 'loading' ? 'Submitting…' : 'Start Your Audit'}
        </button>
      </form>
      {/* Show success or error message */}
      {message && (
        <p className={`mt-4 text-center text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
