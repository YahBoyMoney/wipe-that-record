// Test server environment variables
import fetch from 'node-fetch';

console.log('🔍 Testing server environment for SEND_EMAILS...');

try {
  const response = await fetch('http://localhost:3000/api/env-check');
  const envData = await response.json();
  
  console.log('📊 Server Environment:');
  console.log('NODE_ENV:', envData.NODE_ENV);
  console.log('SEND_EMAILS:', envData.SEND_EMAILS || '❌ NOT SET');
  console.log('DATABASE_URI:', envData.DATABASE_URI);
  
  if (!envData.SEND_EMAILS) {
    console.log('\n❌ SEND_EMAILS is not loaded on server!');
    console.log('💡 Try restarting the development server to pick up .env.local changes');
  } else {
    console.log('\n✅ SEND_EMAILS is loaded on server!');
  }
  
} catch (error) {
  console.error('❌ Failed to check server environment:', error.message);
} 