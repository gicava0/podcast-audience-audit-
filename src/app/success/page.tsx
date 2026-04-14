export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Thank you for your payment.</h1>
        <p className="mb-6 text-gray-600 text-left">
          Your audit is officially underway. We are currently analysng your podcast's content, extracting core themes, and evaluating your positioning. 
          <br /><br />
          Our system is cross-referencing your data to build a comprehensive, actionable strategy report on your audience alignment. Your full breakdown will be delivered to your inbox shortly.
        </p>
        <a 
          href="/" 
          className="inline-block rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-gray-900 shadow-sm hover:bg-cyan-300"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}