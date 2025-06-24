// Direct email test
import { sendDiyConfirmationEmail } from './src/lib/email.js';

console.log('📧 Testing email function directly...');

try {
  console.log('📤 Attempting to send DIY confirmation email...');
  await sendDiyConfirmationEmail('admin@wipethatrecord.com', 'Test User');
  console.log('✅ Email sent successfully!');
} catch (error) {
  console.error('❌ Email failed:', error.message);
  console.error('🔍 Full error:', error);
} 