// Test Payload directly to trigger email hooks
import { getPayload } from 'payload';
import config from './payload.config.js';

console.log('🎯 Testing Payload CMS directly to trigger email hooks...');

try {
  console.log('🔄 Initializing Payload...');
  const payload = await getPayload({ config });
  
  console.log('✅ Payload initialized successfully');
  console.log('📋 Collections:', payload.collections.map(c => c.slug));
  
  const testLead = {
    email: 'admin@wipethatrecord.com',
    first: 'Direct',
    last: 'Test User',
    phone: '555-123-4567',
    convictionType: 'DUI',
    urgency: 'immediate',
    budget: 'flexible',
    paid: true, // This should trigger afterChange hook → email
    amount: 50,
    source: 'direct_test',
    leadScore: 85,
    leadSegment: 'hot',
    emailSequence: 'dui-specific',
    conversionStage: 'diy_purchased',
    emailStatus: 'not_sent',
    emailsSent: 0,
    totalRevenue: 50
  };
  
  console.log('\n📤 Creating lead directly through Payload (should trigger email)...');
  
  const lead = await payload.create({
    collection: 'leads',
    data: testLead
  });
  
  console.log('✅ Lead created through Payload!');
  console.log('📋 Lead ID:', lead.id);
  console.log('📧 This should have triggered the afterChange hook');
  console.log('📬 Check admin@wipethatrecord.com for DIY confirmation email');
  
} catch (error) {
  console.error('❌ Payload test failed:', error.message);
  console.error('🔍 Full error:', error);
} 