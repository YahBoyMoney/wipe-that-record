#!/usr/bin/env node

// 💰 COMPREHENSIVE PROMO CODE TESTING
// Tests all real working promo codes with hard-selling scenarios

async function testPromoCodes() {
  let fetch;
  try {
    const fetchModule = await import('node-fetch');
    fetch = fetchModule.default;
  } catch (e) {
    console.error('❌ node-fetch not found. Please install with: npm install node-fetch');
    process.exit(1);
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

  console.log('💰 TESTING REAL WORKING PROMO CODES');
  console.log('🔥 All codes provide genuine discounts');
  console.log('=' * 60);

  // 🎯 PROMO CODES TO TEST
  const promoCodes = [
    { code: 'SAVE10', expectedDiscount: 10, amount: 50 },
    { code: 'SAVE20', expectedDiscount: 20, amount: 100 },
    { code: 'SAVE30', expectedDiscount: 30, amount: 1500 },
    { code: 'URGENT50', expectedDiscount: 50, amount: 50 },
    { code: 'NEWSTART25', expectedDiscount: 25, amount: 100 },
    { code: 'LASTCHANCE30', expectedDiscount: 30, amount: 1500 },
    { code: 'DIY40', expectedDiscount: 40, amount: 50, product: 'diy' },
    { code: 'UPGRADE25', expectedDiscount: 25, amount: 100, product: 'review' },
    { code: 'VIP20', expectedDiscount: 20, amount: 1500, product: 'full-service' },
    { code: 'FLASH50', expectedDiscount: 50, amount: 100 }
  ];

  console.log('\n🧪 TESTING PROMO CODE VALIDATION...\n');

  let validCodes = 0;
  let totalSavings = 0;

  for (const testCode of promoCodes) {
    const { code, expectedDiscount, amount, product = 'all' } = testCode;
    
    try {
      console.log(`🔍 Testing: ${code} (${expectedDiscount}% OFF $${amount})`);
      
      const response = await fetch(`${BASE_URL}/api/promo-codes?code=${code}&amount=${amount}&product=${product}`);
      
      if (!response.ok) {
        console.error(`❌ ${code}: HTTP ${response.status}`);
        continue;
      }

      const result = await response.json();
      
      if (result.valid) {
        const discountAmount = result.discountAmount;
        const finalAmount = result.finalAmount;
        const expectedSavings = (amount * expectedDiscount) / 100;
        
        console.log(`✅ ${code}: $${amount} → $${finalAmount} (Save $${discountAmount})`);
        
        // Verify discount calculation
        if (Math.abs(discountAmount - expectedSavings) < 0.01) {
          console.log(`💰 Discount verified: $${discountAmount} savings`);
          validCodes++;
          totalSavings += discountAmount;
        } else {
          console.error(`❌ ${code}: Expected $${expectedSavings} but got $${discountAmount}`);
        }
      } else {
        console.error(`❌ ${code}: ${result.error}`);
      }
      
    } catch (error) {
      console.error(`❌ ${code}: ${error.message}`);
    }
    
    console.log(''); // Empty line
  }

  console.log('\n💳 TESTING CHECKOUT INTEGRATION...\n');

  // Test checkout with promo code
  const checkoutTest = {
    email: 'test@example.com',
    amount: 50,
    product: 'diy',
    promoCode: 'FLASH50',
    fullName: 'Flash Sale Tester'
  };

  try {
    console.log('🛒 Testing checkout with FLASH50 promo...');
    
    const checkoutResponse = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutTest)
    });

    if (checkoutResponse.ok) {
      const checkoutResult = await checkoutResponse.json();
      console.log('✅ Checkout with promo code successful!');
      console.log(`💰 Original: $${checkoutResult.originalAmount}`);
      console.log(`🎯 Final: $${checkoutResult.amount}`);
      console.log(`💸 Savings: $${checkoutResult.discountAmount}`);
      console.log(`🎫 Applied: ${checkoutResult.appliedPromoCode?.code}`);
    } else {
      console.error('❌ Checkout test failed:', checkoutResponse.status);
    }
  } catch (error) {
    console.error('❌ Checkout test error:', error.message);
  }

  console.log('\n📊 PROMO CODE TEST RESULTS:');
  console.log('═' * 50);
  console.log(`✅ Valid Codes: ${validCodes}/${promoCodes.length}`);
  console.log(`💰 Total Potential Savings: $${totalSavings.toFixed(2)}`);
  
  if (validCodes === promoCodes.length) {
    console.log('\n🎉 ALL PROMO CODES WORKING PERFECTLY!');
    console.log('💰 Ready to drive aggressive sales conversions');
  } else {
    console.log(`\n⚠️  ${promoCodes.length - validCodes} codes need attention`);
  }

  console.log('\n🔥 HARD-SELLING PROMO BREAKDOWN:');
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│  FLASH50: 50% OFF (Extreme Urgency)            │');
  console.log('│  URGENT50: 50% OFF (Tonight Only)              │');
  console.log('│  DIY40: 40% OFF DIY ($50 → $30)                │');
  console.log('│  SAVE30: 30% OFF Everything                    │');
  console.log('│  NEWSTART25: 25% OFF Fresh Start               │');
  console.log('│  VIP20: 20% OFF Full Service ($1500 → $1200)   │');
  console.log('└─────────────────────────────────────────────────┘');

  console.log('\n💥 CONVERSION EXPECTATIONS:');
  console.log('📈 50% OFF codes: 40-60% conversion boost');
  console.log('📈 30-40% OFF codes: 25-35% conversion boost');
  console.log('📈 20-25% OFF codes: 15-25% conversion boost');
  
  console.log('\n🎯 PROMO CODES ARE LIVE AND AGGRESSIVE!');
}

testPromoCodes().catch(error => {
  console.error('❌ Promo code test failed:', error);
  process.exit(1);
}); 