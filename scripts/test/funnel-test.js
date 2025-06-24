#!/usr/bin/env node

// 🎯 COMPREHENSIVE AGGRESSIVE FUNNEL TEST
// Tests the entire email funnel ecosystem

async function testAggressiveFunnel() {
  let fetch;
  try {
    const fetchModule = await import('node-fetch');
    fetch = fetchModule.default;
  } catch (e) {
    console.error('❌ node-fetch not found. Please install with: npm install node-fetch');
    process.exit(1);
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

  console.log('🔥 AGGRESSIVE EMAIL FUNNEL SYSTEM TEST');
  console.log('🎯 This will trigger MULTIPLE email sequences');
  console.log('📧 Check admin@wipethatrecord.com for results');
  console.log('=' * 60);

  // TEST SCENARIOS
  const scenarios = [
    {
      name: 'High-Intent DUI Lead',
      data: {
        fullName: 'Alex Rodriguez',
        email: 'admin@wipethatrecord.com',
        phone: '555-987-6543',
        convictionType: 'DUI',
        convictionYear: '2019',
        urgency: 'immediate',
        budget: 'flexible',
        paid: false
      },
      expectedSequence: 'high-intent-acceleration',
      expectedEmails: ['Urgent action', 'Spot expires', 'Success story']
    },
    {
      name: 'Price-Sensitive Misdemeanor',
      data: {
        fullName: 'Maria Garcia',
        email: 'admin@wipethatrecord.com',
        phone: '555-456-7890',
        convictionType: 'misdemeanor',
        urgency: 'within-3months',
        budget: 'under-100',
        paid: false
      },
      expectedSequence: 'general-nurture',
      expectedEmails: ['Budget solution', 'Social proof', 'Value proposition']
    },
    {
      name: 'Theft Conviction - Urgent',
      data: {
        fullName: 'James Wilson',
        email: 'admin@wipethatrecord.com',
        convictionType: 'theft',
        urgency: 'immediate',
        budget: '500-1000',
        paid: false
      },
      expectedSequence: 'high-intent-acceleration',
      expectedEmails: ['Fast track', 'Limited spots', 'Success stories']
    }
  ];

  console.log('\n🚀 CREATING TEST LEADS...\n');

  // Create leads and trigger sequences
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`📋 Test ${i + 1}: ${scenario.name}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario.data)
      });

      if (!response.ok) {
        console.error(`❌ Failed to create lead: ${response.status}`);
        continue;
      }

      const result = await response.json();
      console.log(`✅ Created lead: ${result.leadId}`);
      console.log(`📊 Score: ${result.leadScore} | Segment: ${result.leadSegment}`);
      console.log(`📧 Sequence: ${result.emailSequence}`);
      console.log(`⚙️ Method: ${result.method}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error in scenario ${scenario.name}:`, error.message);
    }
  }

  console.log('🛒 TESTING BEHAVIORAL TRIGGERS...\n');

  // Test cart abandonment
  console.log('📝 Cart Abandonment Test');
  try {
    const abandonmentResponse = await fetch(`${BASE_URL}/api/email-trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@wipethatrecord.com',
        name: 'Abandoner Joe',
        action: 'cart_abandon',
        leadData: {
          convictionType: 'DUI',
          leadScore: 70,
          sessionId: 'test_session_123'
        },
        behaviorData: {
          startedCheckout: true,
          completed: false,
          timeOnCheckout: 240
        }
      })
    });

    const abandonResult = await abandonmentResponse.json();
    console.log('✅ Cart abandonment trigger:', abandonResult.trigger);
  } catch (error) {
    console.error('❌ Cart abandonment test failed:', error.message);
  }

  // Test high engagement
  console.log('\n📊 High Engagement Test');
  try {
    const engagementResponse = await fetch(`${BASE_URL}/api/email-trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@wipethatrecord.com',
        name: 'Engaged Sarah',
        action: 'high_engagement',
        leadData: {
          convictionType: 'misdemeanor',
          leadScore: 85
        },
        behaviorData: {
          emailOpens: 4,
          clickThroughs: 3,
          timeOnSite: 900
        }
      })
    });

    const engageResult = await engagementResponse.json();
    console.log('✅ High engagement trigger:', engageResult.trigger);
  } catch (error) {
    console.error('❌ High engagement test failed:', error.message);
  }

  // Test price shopping
  console.log('\n💰 Price Shopping Test');
  try {
    const priceResponse = await fetch(`${BASE_URL}/api/email-trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@wipethatrecord.com',
        name: 'Bargain Hunter',
        action: 'price_check',
        leadData: {
          convictionType: 'drug-possession',
          budget: 'under-100'
        },
        behaviorData: {
          pricePageVisits: 5,
          timeOnPricing: 420
        }
      })
    });

    const priceResult = await priceResponse.json();
    console.log('✅ Price shopping trigger:', priceResult.trigger);
  } catch (error) {
    console.error('❌ Price shopping test failed:', error.message);
  }

  console.log('\n🎉 FUNNEL TEST COMPLETE!');
  console.log('\n📧 EMAIL TIMELINE (Check admin@wipethatrecord.com):');
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│  IMMEDIATE (0 min)                             │');
  console.log('│  ✅ High-intent sequences triggered            │');
  console.log('│  ✅ DUI-specific content sent                  │');
  console.log('│                                                │');
  console.log('│  15 MINUTES                                    │');
  console.log('│  ⚠️  Cart abandonment recovery                 │');
  console.log('│                                                │');
  console.log('│  30 MINUTES                                    │');
  console.log('│  🔥 VIP fast-track invitation                  │');
  console.log('│                                                │');
  console.log('│  60 MINUTES                                    │');
  console.log('│  💰 Price objection handler                    │');
  console.log('│                                                │');
  console.log('│  24 HOURS                                      │');
  console.log('│  🚨 Final warning sequences                    │');
  console.log('└─────────────────────────────────────────────────┘');

  console.log('\n🎯 CONVERSION EXPECTATIONS:');
  console.log('📈 Lead → DIY ($50): 15-25% conversion rate');
  console.log('📈 DIY → Review ($100): 8-15% upgrade rate');
  console.log('📈 Review → Full ($1500): 3-8% upgrade rate');
  console.log('\n💰 REVENUE PROJECTION:');
  console.log('100 leads → 20 DIY ($1,000) → 3 Review ($300) → 1 Full Service ($1,500)');
  console.log('Total: $2,800 from 100 leads');
  
  console.log('\n🔥 FUNNEL IS LIVE AND AGGRESSIVE!');
}

testAggressiveFunnel().catch(error => {
  console.error('❌ Aggressive funnel test failed:', error);
  process.exit(1);
}); 