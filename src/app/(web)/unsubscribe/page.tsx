'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ You have been successfully unsubscribed from all email communications.');
      } else {
        setMessage('❌ There was an error processing your request. Please try again.');
      }
    } catch (error) {
      setMessage('❌ There was an error processing your request. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Request</h1>
          <p className="text-gray-600">No email address provided for unsubscribe.</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribe Request</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Website
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Unsubscribe</h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry to see you go! You are requesting to unsubscribe the email address:
        </p>
        
        <div className="bg-gray-100 p-3 rounded-lg mb-6 text-center">
          <strong>{email}</strong>
        </div>
        
        <form onSubmit={handleUnsubscribe} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for unsubscribing (optional):
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a reason...</option>
              <option value="too_many_emails">Too many emails</option>
              <option value="not_relevant">Content not relevant</option>
              <option value="never_signed_up">Never signed up</option>
              <option value="spam">Emails are spam</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Processing...' : 'Unsubscribe Me'}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
          <p>Changed your mind? <a href="/" className="text-blue-600 hover:underline">Return to website</a></p>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div>Loading...</div></div>}>
      <UnsubscribeForm />
    </Suspense>
  );
} 