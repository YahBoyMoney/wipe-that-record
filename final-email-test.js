// Final email test with proper logging
import fetch from 'node-fetch';

console.log('🎯 FINAL EMAIL TEST - This should trigger an email!');
console.log('📧 Email will be sent to: admin@wipethatrecord.com');

const testLead = {
  fullName: 'Email Test Success',
  email: 'admin@wipethatrecord.com',
  phone: '555-123-4567',
  convictionType: 'DUI',
  urgency: 'immediate',
  budget: 'flexible',
  paid: true, // 🔥 This should trigger DIY confirmation email
  amount: 50,
  source: 'test'
};

console.log('\n📤 Creating paid lead (should trigger DIY email)...');

try {
  const response = await fetch('http://localhost:3000/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testLead)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Error:', errorText);
    process.exit(1);
  }

  const result = await response.json();
  
  console.log('✅ Lead created successfully!');
  console.log('📋 Lead ID:', result.leadId);
  console.log('📊 Lead Score:', result.leadScore);
  console.log('🎯 Lead Segment:', result.leadSegment);
  console.log('⚙️ Method:', result.method);
  
  console.log('\n📧 EMAIL STATUS:');
  console.log('✅ Lead was created with paid: true');
  console.log('✅ This should have triggered a DIY confirmation email');
  console.log('✅ Check your email inbox at: admin@wipethatrecord.com');
  console.log('📬 Subject should be: "Your DIY Expungement Kit is Ready!"');
  
  console.log('\n🔍 If you don\'t see the email:');
  console.log('1. Check your spam/junk folder');
  console.log('2. Check server logs for email errors');
  console.log('3. Verify Zoho SMTP credentials are correct');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  
  if (error.code === 'ECONNREFUSED') {
    console.error('💡 Server not running. Start with: pnpm dev');
  }
} 