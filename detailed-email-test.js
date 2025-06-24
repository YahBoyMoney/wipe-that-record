// Detailed email test to see full response
import fetch from 'node-fetch';

console.log('🔍 DETAILED EMAIL TEST - Checking response for emailSent field');

const testLead = {
  fullName: 'Detailed Test User',
  email: 'admin@wipethatrecord.com',
  phone: '555-123-4567',
  convictionType: 'DUI',
  paid: true,  // 🔥 This should trigger email
  amount: 50
};

console.log('📤 Test data being sent:');
console.log(JSON.stringify(testLead, null, 2));

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
  
  console.log('\n📨 FULL API RESPONSE:');
  console.log(JSON.stringify(result, null, 2));
  
  console.log('\n🔍 EMAIL STATUS CHECK:');
  console.log('emailSent field:', result.emailSent);
  console.log('method used:', result.method);
  
  if (result.emailSent === true) {
    console.log('✅ Email was sent successfully!');
    console.log('📧 Check your inbox at: admin@wipethatrecord.com');
  } else if (result.emailSent === false) {
    console.log('❌ Email was NOT sent (paid was false or email failed)');
  } else {
    console.log('⚠️ emailSent field not found in response');
  }

} catch (error) {
  console.error('❌ Test failed:', error.message);
} 