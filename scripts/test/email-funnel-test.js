#!/usr/bin/env node

// Comprehensive Email Funnel Test
// Tests all behavioral triggers and sequences

async function testEmailFunnel() {
  let fetch;
  try {
    const fetchModule = await import('node-fetch');
    fetch = fetchModule.default;
  } catch (e) {
    console.error('❌ node-fetch not found. Please install with: npm install node-fetch');
    process.exit(1);
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

  console.log('🎯 TESTING AGGRESSIVE EMAIL FUNNEL SYSTEM');
  console.log('=' * 50);

  // Test 1: High-Intent Lead (Should trigger acceleration sequence)
  console.log('\n🔥 TEST 1: High-Intent Lead');
  const highIntentLead = {
    fullName: 'High Intent User',
    email: 'admin@wipethatrecord.com',
    phone: '555-123-4567',
    convictionType: 'DUI',
    urgency: 'immediate',
    budget: 'flexible',
    paid: false // Should trigger funnel
  };

  try {
    const response = await fetch(`${BASE_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(highIntentLead)
    });

    const result = await response.json();
    console.log('✅ High-intent lead created:', result.leadId);
    console.log('📊 Lead score:', result.leadScore);
    console.log('🎯 Segment:', result.leadSegment);
    console.log('📧 Email sequence:', result.emailSequence);
  } catch (error) {
    console.error('❌ High-intent test failed:', error.message);
  }

  // Test 2: Cart Abandonment Trigger
  console.log('\n🛒 TEST 2: Cart Abandonment');
  try {
    const abandonmentData = {
      email: 'admin@wipethatrecord.com',
      name: 'Cart Abandoner',
      leadId: 'test-lead-123',
      action: 'cart_abandon',
      leadData: {
        convictionType: 'Misdemeanor',
        leadScore: 65,
        urgency: 'within-month',
        sessionId: 'checkout_123'
      },
      behaviorData: {
        startedCheckout: true,
        completed: false,
        timeOnCheckout: 300 // 5 minutes
      }
    };

    const response = await fetch(`${BASE_URL}/api/email-trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(abandonmentData)
    });

    const result = await response.json();
    console.log('✅ Cart abandonment trigger result:', result);
  } catch (error) {
    console.error('❌ Cart abandonment test failed:', error.message);
  }

  // Test 3: High Engagement Trigger
  console.log('\n📊 TEST 3: High Engagement Behavior');
  try {
    const engagementData = {
      email: 'admin@wipethatrecord.com',
      name: 'Engaged User',
      leadId: 'test-lead-456',
      action: 'high_engagement',
      leadData: {
        convictionType: 'DUI',
        leadScore: 80,
        urgency: 'immediate'
      },
      behaviorData: {
        emailOpens: 4,
        clickThroughs: 3,
        timeOnSite: 900 // 15 minutes
      }
    };

    const response = await fetch(`${BASE_URL}/api/email-trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(engagementData)
    });

    const result = await response.json();
    console.log('✅ High engagement trigger result:', result);
  } catch (error) {
    console.error('❌ High engagement test failed:', error.message);
  }

  // Test 4: Price Shopping Behavior
  console.log('\n💰 TEST 4: Price Shopping');
  try {
    const priceShopData = {
      email: 'admin@wipethatrecord.com',
      name: 'Price Shopper',
      leadId: 'test-lead-789',
      action: 'price_check',
      leadData: {
        convictionType: 'Theft',
        leadScore: 45,
        budget: 'under-100'
      },
      behaviorData: {
        pricePageVisits: 4,
        timeOnPricing: 600
      }
    };

    const response = await fetch(`${BASE_URL}/api/email-trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(priceShopData)
    });

    const result = await response.json();
    console.log('✅ Price shopping trigger result:', result);
  } catch (error) {
    console.error('❌ Price shopping test failed:', error.message);
  }

  // Test 5: Get Available Triggers
  console.log('\n📋 TEST 5: Available Triggers');
  try {
    const response = await fetch(`${BASE_URL}/api/email-trigger`, {
      method: 'GET'
    });

    const result = await response.json();
    console.log('✅ Available triggers:');
    result.triggers.forEach(trigger => {
      console.log(`   - ${trigger.name} (${trigger.priority} priority, ${trigger.delayMinutes}min delay)`);
    });
  } catch (error) {
    console.error('❌ Triggers fetch failed:', error.message);
  }

  console.log('\n🎉 EMAIL FUNNEL TESTING COMPLETE!');
  console.log('\n📧 CHECK YOUR EMAIL: admin@wipethatrecord.com');
  console.log('📬 You should receive multiple targeted emails based on the test scenarios');
  
  console.log('\n🎯 EXPECTED EMAILS:');
  console.log('1. High-intent acceleration sequence (immediate)');
  console.log('2. Cart abandonment recovery (15 min delay)');
  console.log('3. VIP fast-track invitation (30 min delay)');
  console.log('4. Price objection handler (60 min delay)');
}

testEmailFunnel().catch(error => {
  console.error('❌ Email funnel test failed:', error);
  process.exit(1);
}); 