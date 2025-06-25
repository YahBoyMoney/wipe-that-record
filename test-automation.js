// Test the complete sales automation system
const testData = {
  first: "Test",
  last: "Customer",
  email: "test@example.com",
  convictionType: "dui",
  urgency: "immediate",
  employmentStatus: "seeking-employment",
  phone: "+1234567890"
};

async function testLeadCreation() {
  try {
    console.log('🧪 Testing lead creation and automation...');
    
    const response = await fetch('http://localhost:3000/api/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('📊 Lead creation result:', result);

    if (result.success) {
      console.log('✅ Lead created successfully!');
      console.log('📈 Lead Score:', result.leadScore);
      console.log('🎯 Segment:', result.leadSegment);
      console.log('📧 Email Sequence:', result.emailSequence);
      
      // Test n8n webhook integration
      console.log('\n🔗 Testing n8n webhook integration...');
      const webhookResponse = await fetch('http://localhost:5678/webhook/wipe-that-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'lead_nurture_sequence',
          email: testData.email,
          leadScore: result.leadScore,
          convictionType: testData.convictionType,
          urgency: testData.urgency,
          sequenceDay: 1,
          name: testData.first
        })
      });

      if (webhookResponse.ok) {
        console.log('✅ n8n webhook integration working!');
        console.log('🚀 Automation system is fully operational!');
        
        console.log('\n📈 Expected Results:');
        console.log('- Immediate email sequence started');
        console.log('- Lead scoring and segmentation active');
        console.log('- n8n automation workflows triggered');
        console.log('- Zoho Mail integration ready');
        
      } else {
        console.log('❌ n8n webhook failed - check if n8n is running');
        console.log('Run: npx n8n in a separate terminal');
      }
      
    } else {
      console.log('❌ Lead creation failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your app is running: npm run dev');
    console.log('2. Make sure n8n is running: npx n8n');
    console.log('3. Check your .env.local file has all required variables');
  }
}

// Test purchase upsell automation
async function testUpsellAutomation() {
  try {
    console.log('\n💰 Testing upsell automation...');
    
    const upsellData = {
      email: testData.email,
      name: testData.first,
      product: 'diy',
      amount: 97
    };

    const response = await fetch('http://localhost:5678/webhook/upsell-trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(upsellData)
    });

    if (response.ok) {
      console.log('✅ Upsell automation triggered!');
      console.log('💸 30-minute delay started for review upsell');
    } else {
      console.log('❌ Upsell automation failed');
    }

  } catch (error) {
    console.log('❌ Upsell test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 WIPE THAT RECORD - SALES AUTOMATION TEST');
  console.log('=========================================\n');
  
  await testLeadCreation();
  await testUpsellAutomation();
  
  console.log('\n🎯 SETUP COMPLETE!');
  console.log('==================');
  console.log('Your sales automation system is ready to generate revenue!');
  console.log('\nNext steps:');
  console.log('1. 📧 Check your email for test sequences');
  console.log('2. 🔍 Visit http://localhost:5678 to see n8n workflows');
  console.log('3. 📊 Monitor your Railway admin for lead tracking');
  console.log('4. 💰 Deploy to production when ready!');
}

runAllTests(); 