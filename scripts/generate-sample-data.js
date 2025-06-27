#!/usr/bin/env node

// Generate sample data for testing the application
require('dotenv').config();

async function generateSampleLeads() {
  const sampleLeads = [];
  
  // Generate 50 sample leads with realistic data
  const convictionTypes = ['DUI', 'Misdemeanor', 'Felony', 'Drug Possession', 'Assault', 'Theft'];
  const sources = ['google_ads', 'organic_search', 'facebook_ads', 'referral', 'direct'];
  const stages = ['lead', 'diy_purchased', 'review_upgrade', 'full_service'];
  const cities = ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'Fresno'];
  
  for (let i = 0; i < 50; i++) {
    const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const convictionType = convictionTypes[Math.floor(Math.random() * convictionTypes.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // Calculate revenue based on stage
    let totalRevenue = 0;
    let paid = false;
    
    if (stage === 'diy_purchased') {
      totalRevenue = 50;
      paid = true;
    } else if (stage === 'review_upgrade') {
      totalRevenue = 100;
      paid = true;
    } else if (stage === 'full_service') {
      totalRevenue = 1500;
      paid = true;
    }
    
    // Lead scoring based on various factors
    let leadScore = Math.floor(Math.random() * 100);
    if (convictionType === 'DUI') leadScore += 10;
    if (source === 'google_ads') leadScore += 5;
    if (city === 'Los Angeles' || city === 'San Francisco') leadScore += 5;
    leadScore = Math.min(leadScore, 100);
    
    const lead = {
      email: `user${i + 1}@example.com`,
      first: `User`,
      last: `${i + 1}`,
      phone: `555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      convictionType,
      convictionYear: 2015 + Math.floor(Math.random() * 8),
      source,
      city,
      state: 'California',
      urgency: ['immediate', 'within_month', 'no_rush'][Math.floor(Math.random() * 3)],
      budget: ['under_100', '100_500', '500_plus'][Math.floor(Math.random() * 3)],
      paid,
      totalRevenue,
      conversionStage: stage,
      leadScore,
      leadSegment: leadScore >= 75 ? 'hot' : leadScore >= 50 ? 'warm' : leadScore >= 25 ? 'lukewarm' : 'cold',
      emailStatus: ['delivered', 'sent', 'pending', 'failed'][Math.floor(Math.random() * 4)],
      deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      utmCampaign: source === 'google_ads' ? 'socal_expungement' : source === 'facebook_ads' ? 'dui_cleanup' : null,
      timeToUpgrade: paid ? Math.floor(Math.random() * 72) : null, // hours
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString(),
    };
    
    sampleLeads.push(lead);
  }
  
  return sampleLeads;
}

async function insertSampleData() {
  try {
    console.log('🔧 Generating sample data...');
    
    const leads = await generateSampleLeads();
    
    console.log(`📊 Generated ${leads.length} sample leads`);
    console.log('💰 Revenue breakdown:');
    
    const totalRevenue = leads.reduce((sum, lead) => sum + lead.totalRevenue, 0);
    const paidLeads = leads.filter(lead => lead.paid);
    const conversionRate = (paidLeads.length / leads.length * 100).toFixed(1);
    
    console.log(`   Total Revenue: $${totalRevenue.toLocaleString()}`);
    console.log(`   Paid Customers: ${paidLeads.length}/${leads.length} (${conversionRate}%)`);
    console.log(`   Average Order Value: $${paidLeads.length > 0 ? Math.round(totalRevenue / paidLeads.length) : 0}`);
    
    // Save to JSON file for manual import if needed
    const fs = require('fs');
    fs.writeFileSync('./sample-leads.json', JSON.stringify(leads, null, 2));
    
    console.log('✅ Sample data saved to sample-leads.json');
    console.log('💡 You can import this data through the admin panel or API');
    
    // Try to insert via API
    console.log('\\n🚀 Attempting to insert via API...');
    
    for (const lead of leads.slice(0, 10)) { // Insert first 10 via API
      try {
        const response = await fetch('http://localhost:3000/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        });
        
        if (response.ok) {
          console.log(`✅ Inserted lead: ${lead.email}`);
        } else {
          console.log(`⚠️ Failed to insert ${lead.email}: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ API error for ${lead.email}: ${error.message}`);
        break;
      }
    }
    
    console.log('\\n🎉 Sample data generation complete!');
    console.log('🔍 Check your admin panel at http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error generating sample data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  insertSampleData();
}

module.exports = { generateSampleLeads, insertSampleData };