// Simple email test
import fetch from 'node-fetch';

const testData = {
  fullName: "Quick Test User",
  email: "admin@wipethatrecord.com",
  phone: "555-123-4567",
  paid: true, // This should trigger a DIY confirmation email
  convictionType: "DUI"
};

console.log('📧 Testing email with paid lead...');
console.log('📤 Sending to: admin@wipethatrecord.com');

try {
  const response = await fetch('http://localhost:3000/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
  });

  const result = await response.json();
  console.log('📨 Response:', result);
  
  if (result.success) {
    console.log('✅ Lead created successfully!');
    console.log('📧 Check your email at admin@wipethatrecord.com');
    console.log('🔍 If no email, check server logs for email errors');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
} 