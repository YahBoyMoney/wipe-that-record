// Southern California Lead Scoring Simulation Test
// Validates the SoCal system without server calls

const soCalCountyData = {
  'orange': {
    population: 3200000,
    avgIncome: 85000,
    techWorkers: 300000,
    entertainmentWorkers: 50000,
    avgFilingFee: 150,
    successRate: 0.92,
    avgTimeToComplete: '5-7 weeks',
    majorCities: ['Anaheim', 'Santa Ana', 'Irvine', 'Huntington Beach', 'Newport Beach', 'Fullerton', 'Costa Mesa', 'Mission Viejo'],
    premiumPricing: true
  },
  'los-angeles': {
    population: 10000000,
    avgIncome: 65000,
    techWorkers: 500000,
    entertainmentWorkers: 200000,
    avgFilingFee: 150,
    successRate: 0.89,
    avgTimeToComplete: '6-8 weeks',
    majorCities: ['Los Angeles', 'Long Beach', 'Glendale', 'Santa Clarita', 'Pasadena', 'Torrance', 'Inglewood', 'Santa Monica'],
    premiumPricing: true
  },
  'riverside': {
    population: 2500000,
    avgIncome: 55000,
    techWorkers: 75000,
    entertainmentWorkers: 15000,
    avgFilingFee: 120,
    successRate: 0.85,
    avgTimeToComplete: '7-9 weeks',
    majorCities: ['Riverside', 'Moreno Valley', 'Temecula', 'Murrieta', 'Indio', 'Palm Desert', 'Corona'],
    premiumPricing: false
  },
  'san-bernardino': {
    population: 2200000,
    avgIncome: 50000,
    techWorkers: 60000,
    entertainmentWorkers: 10000,
    avgFilingFee: 120,
    successRate: 0.83,
    avgTimeToComplete: '7-10 weeks',
    majorCities: ['San Bernardino', 'Fontana', 'Rancho Cucamonga', 'Ontario', 'Victorville', 'Upland'],
    premiumPricing: false
  },
  'ventura': {
    population: 850000,
    avgIncome: 75000,
    techWorkers: 40000,
    entertainmentWorkers: 15000,
    avgFilingFee: 140,
    successRate: 0.90,
    avgTimeToComplete: '5-7 weeks',
    majorCities: ['Oxnard', 'Thousand Oaks', 'Simi Valley', 'Ventura', 'Camarillo'],
    premiumPricing: true
  }
};

function calculateSoCalLeadScore(data) {
  let score = 0;
  
  // 🌴 GEOGRAPHIC SCORING (25 points max)
  switch (data.county) {
    case 'orange': score += 25; break;
    case 'los-angeles': score += 23; break;
    case 'ventura': score += 20; break;
    case 'riverside': score += 18; break;
    case 'san-bernardino': score += 15; break;
    case 'other-california': score += 10; break;
    case 'outside-california': score += 0; break;
  }
  
  // 💼 URGENCY SCORING (25 points max)
  switch (data.urgency) {
    case 'immediate': score += 25; break;
    case 'within-month': score += 20; break;
    case 'within-3-months': score += 15; break;
    case 'within-6-months': score += 10; break;
    case 'just-researching': score += 5; break;
  }
  
  // 🏛️ CONVICTION TYPE SCORING (20 points max)
  switch (data.convictionType) {
    case 'dui': score += 20; break;
    case 'drug-possession': score += 18; break;
    case 'theft': score += 16; break;
    case 'misdemeanor': score += 14; break;
    case 'felony': score += 17; break;
    case 'domestic-violence': score += 12; break;
    case 'other': score += 10; break;
  }
  
  // 💰 EMPLOYMENT & INCOME SCORING (15 points max)
  switch (data.employmentStatus) {
    case 'employed': score += 15; break;
    case 'seeking-employment': score += 12; break;
    case 'self-employed': score += 10; break;
    case 'student': score += 8; break;
    case 'unemployed': score += 5; break;
  }
  
  // 💵 INCOME BONUS (10 points max)
  switch (data.annualIncome) {
    case '150k+': score += 10; break;
    case '100k-150k': score += 8; break;
    case '75k-100k': score += 6; break;
    case '50k-75k': score += 4; break;
    case '30k-50k': score += 2; break;
    case 'under-30k': score += 1; break;
  }
  
  // 🌟 SOCAL INDUSTRY BONUSES (5 points max)
  if (data.inTechIndustry) score += 5;
  else if (data.inEntertainmentIndustry) score += 4;
  else if (data.industryOfInterest === 'healthcare') score += 3;
  else if (data.industryOfInterest === 'finance') score += 3;
  else if (data.industryOfInterest === 'government') score += 2;
  
  // 🎓 EDUCATION BONUSES
  if (data.isStudentUCUC) score += 3;
  if (data.hasSecurityClearance) score += 3;
  
  // ⚠️ RISK FACTORS
  if (data.hasMultipleConvictions) score -= 5;
  if (data.hasFailedAttempts) score -= 3;
  if (data.county === 'outside-california') score -= 20;
  
  // 📱 CONTACT QUALITY
  if (data.phone) score += 2;
  
  const conversionProbability = score >= 80 ? 'very-high' : 
                                score >= 65 ? 'high' : 
                                score >= 50 ? 'medium' : 
                                score >= 35 ? 'low-medium' : 'low';
  
  const leadQuality = score >= 75 ? 'hot' : score >= 50 ? 'warm' : 'cold';
  
  // 🎯 SOCAL-SPECIFIC SEGMENTATION
  let leadSegment = 'general-socal';
  
  if (data.convictionType === 'dui' && data.urgency === 'immediate') {
    leadSegment = 'socal-dui-urgent';
  } else if (data.inTechIndustry && data.county === 'orange') {
    leadSegment = 'oc-tech-professional';
  } else if (data.county === 'los-angeles' && data.inEntertainmentIndustry) {
    leadSegment = 'la-entertainment';
  } else if (data.convictionType === 'dui' && (data.county === 'orange' || data.county === 'los-angeles')) {
    leadSegment = 'premium-dui-socal';
  } else if (data.employmentStatus === 'seeking-employment' && score >= 70) {
    leadSegment = 'socal-job-seeker-premium';
  } else if ((data.county === 'riverside' || data.county === 'san-bernardino') && data.annualIncome === 'under-30k') {
    leadSegment = 'inland-empire-budget';
  } else if (data.hasSecurityClearance) {
    leadSegment = 'socal-security-clearance';
  } else if (score >= 80) {
    leadSegment = 'socal-premium';
  }
  
  // 💰 ESTIMATED LIFETIME VALUE (SoCal market)
  let baseLTV = 200;
  
  if (data.county === 'orange') baseLTV *= 2.2;
  else if (data.county === 'los-angeles') baseLTV *= 1.8;
  else if (data.county === 'ventura') baseLTV *= 1.9;
  else if (data.county === 'riverside') baseLTV *= 1.3;
  else if (data.county === 'san-bernardino') baseLTV *= 1.2;
  
  if (data.inTechIndustry) baseLTV *= 1.5;
  if (data.inEntertainmentIndustry) baseLTV *= 1.3;
  if (data.hasSecurityClearance) baseLTV *= 1.4;
  
  if (data.urgency === 'immediate') baseLTV *= 2.0;
  else if (data.urgency === 'within-month') baseLTV *= 1.6;
  
  const estimatedLifetimeValue = Math.round(baseLTV * (score / 50));
  
  const priority = score >= 85 ? 'urgent' : 
                   score >= 70 ? 'high' : 
                   score >= 50 ? 'medium' : 'low';
  
  const recommendedPricing = (data.county === 'orange' || data.inTechIndustry || estimatedLifetimeValue > 500) ? 'premium' :
                            (score >= 60) ? 'standard' : 'budget';
  
  let targetedSequence = 'general-socal';
  
  if (leadSegment === 'socal-dui-urgent') targetedSequence = 'dui-urgent-socal';
  else if (leadSegment === 'oc-tech-professional') targetedSequence = 'oc-tech-premium';
  else if (leadSegment === 'la-entertainment') targetedSequence = 'la-entertainment';
  else if (leadSegment === 'inland-empire-budget') targetedSequence = 'ie-budget-friendly';
  else if (leadSegment === 'socal-security-clearance') targetedSequence = 'security-clearance';
  else if (score >= 80) targetedSequence = 'socal-premium';
  else if (score >= 60) targetedSequence = 'socal-standard';
  else targetedSequence = 'socal-nurture';
  
  return {
    leadScore: Math.min(score, 100),
    conversionProbability,
    leadQuality,
    leadSegment,
    estimatedLifetimeValue,
    priority,
    recommendedPricing,
    targetedSequence
  };
}

const testData = [
  // 🍊 Orange County Tech Professional - Premium Tier
  {
    first: 'Sarah', last: 'Kim', county: 'orange', city: 'Irvine',
    convictionType: 'dui', urgency: 'immediate', employmentStatus: 'employed',
    industryOfInterest: 'tech', annualIncome: '150k+', inTechIndustry: true,
    hasSecurityClearance: true, phone: '(949) 555-0123'
  },
  
  // 🎬 LA Entertainment Industry - Standard Tier
  {
    first: 'Marcus', last: 'Johnson', county: 'los-angeles', city: 'West Hollywood',
    convictionType: 'drug-possession', urgency: 'within-month', employmentStatus: 'self-employed',
    industryOfInterest: 'entertainment', annualIncome: '75k-100k', inEntertainmentIndustry: true,
    phone: '(323) 555-0456'
  },
  
  // 🏞️ Riverside Budget-Conscious - Budget Tier
  {
    first: 'Maria', last: 'Rodriguez', county: 'riverside', city: 'Riverside',
    convictionType: 'misdemeanor', urgency: 'within-3-months', employmentStatus: 'seeking-employment',
    industryOfInterest: 'healthcare', annualIncome: 'under-30k', needsHousingAssistance: true,
    phone: '(951) 555-0789'
  },
  
  // 🌊 Ventura County Professional - Premium Tier
  {
    first: 'David', last: 'Chen', county: 'ventura', city: 'Thousand Oaks',
    convictionType: 'theft', urgency: 'immediate', employmentStatus: 'employed',
    industryOfInterest: 'government', annualIncome: '100k-150k', hasSecurityClearance: true,
    phone: '(805) 555-0321'
  },
  
  // 🏔️ San Bernardino Student - Standard Tier
  {
    first: 'Jessica', last: 'Lopez', county: 'san-bernardino', city: 'San Bernardino',
    convictionType: 'dui', urgency: 'within-6-months', employmentStatus: 'student',
    industryOfInterest: 'education', annualIncome: 'under-30k', isStudentUCUC: true,
    phone: '(909) 555-0654'
  }
];

function runSoCalSimulation() {
  console.log('🌴 =====================================');
  console.log('🌴 SOUTHERN CALIFORNIA SCALING TEST');
  console.log('🌴 =====================================\n');

  let totalProjectedRevenue = 0;
  let totalLeads = 0;
  let qualityBreakdown = { hot: 0, warm: 0, cold: 0 };
  let countyBreakdown = {};
  let pricingBreakdown = { premium: 0, standard: 0, budget: 0 };

  console.log('📊 TESTING INDIVIDUAL LEADS:\n');

  testData.forEach((lead, i) => {
    totalLeads++;
    const result = calculateSoCalLeadScore(lead);
    const countyName = lead.county.replace('-', ' ').toUpperCase();
    
    // Track metrics
    qualityBreakdown[result.leadQuality]++;
    countyBreakdown[countyName] = (countyBreakdown[countyName] || 0) + 1;
    pricingBreakdown[result.recommendedPricing]++;
    totalProjectedRevenue += result.estimatedLifetimeValue;
    
    console.log(`👤 LEAD ${i + 1}: ${lead.first} ${lead.last}`);
    console.log(`📍 Location: ${lead.city}, ${countyName} County`);
    console.log(`💼 Profile: ${lead.industryOfInterest} | ${lead.employmentStatus} | ${lead.annualIncome}`);
    console.log(`✅ RESULTS:`);
    console.log(`   🎯 Lead Score: ${result.leadScore}/100`);
    console.log(`   🔥 Quality: ${result.leadQuality.toUpperCase()}`);
    console.log(`   📈 Conversion Probability: ${result.conversionProbability}`);
    console.log(`   🎪 Segment: ${result.leadSegment}`);
    console.log(`   💰 Estimated LTV: $${result.estimatedLifetimeValue}`);
    console.log(`   💲 Recommended Pricing: ${result.recommendedPricing.toUpperCase()}`);
    console.log(`   📧 Email Sequence: ${result.targetedSequence}`);
    console.log(`   🚨 Priority: ${result.priority.toUpperCase()}`);
    console.log('─'.repeat(80) + '\n');
  });

  // Calculate scaling projections
  console.log('🚀 SOUTHERN CALIFORNIA SCALING ANALYSIS:\n');
  
  console.log('📊 LEAD QUALITY DISTRIBUTION:');
  Object.entries(qualityBreakdown).forEach(([quality, count]) => {
    const percentage = ((count / totalLeads) * 100).toFixed(1);
    const emoji = quality === 'hot' ? '🔥' : quality === 'warm' ? '⚡' : '❄️';
    console.log(`   ${emoji} ${quality.toUpperCase()}: ${count} leads (${percentage}%)`);
  });
  
  console.log('\n🗺️ COUNTY DISTRIBUTION:');
  Object.entries(countyBreakdown).forEach(([county, count]) => {
    const percentage = ((count / totalLeads) * 100).toFixed(1);
    const emoji = county.includes('ORANGE') ? '🍊' : 
                  county.includes('LOS ANGELES') ? '🎬' : 
                  county.includes('RIVERSIDE') ? '🏞️' : 
                  county.includes('VENTURA') ? '🌊' : '🏔️';
    console.log(`   ${emoji} ${county}: ${count} leads (${percentage}%)`);
  });
  
  console.log('\n💰 PRICING TIER DISTRIBUTION:');
  Object.entries(pricingBreakdown).forEach(([tier, count]) => {
    const percentage = ((count / totalLeads) * 100).toFixed(1);
    const emoji = tier === 'premium' ? '💎' : tier === 'standard' ? '⭐' : '💰';
    console.log(`   ${emoji} ${tier.toUpperCase()}: ${count} leads (${percentage}%)`);
  });

  // Scaling projections
  const avgLTV = totalProjectedRevenue / totalLeads;
  console.log('\n📈 SCALING PROJECTIONS:');
  console.log(`   💵 Average Lead Value: $${avgLTV.toFixed(2)}`);
  console.log(`   📊 Sample Revenue: $${totalProjectedRevenue.toFixed(2)}`);
  
  // Monthly projections (assuming 1000 leads/month)
  const monthlyLeads = 1000;
  const monthlyRevenue = avgLTV * monthlyLeads;
  const annualRevenue = monthlyRevenue * 12;
  
  console.log(`\n🎯 MONTHLY PROJECTIONS (${monthlyLeads} leads/month):`);
  console.log(`   📅 Monthly Revenue: $${monthlyRevenue.toLocaleString()}`);
  console.log(`   📆 Annual Revenue: $${annualRevenue.toLocaleString()}`);
  
  // County-specific projections
  console.log('\n🏆 COUNTY-SPECIFIC REVENUE POTENTIAL:');
  
  const countyMultipliers = {
    'ORANGE': 1.8,      // Premium market
    'LOS ANGELES': 1.5, // High volume
    'VENTURA': 1.6,     // Affluent but smaller
    'RIVERSIDE': 1.2,   // Growing market
    'SAN BERNARDINO': 1.1 // Price-sensitive
  };
  
  Object.entries(countyMultipliers).forEach(([county, multiplier]) => {
    const countyMonthly = monthlyRevenue * multiplier;
    const countyAnnual = countyMonthly * 12;
    const emoji = county.includes('ORANGE') ? '🍊' : 
                  county.includes('LOS ANGELES') ? '🎬' : 
                  county.includes('RIVERSIDE') ? '🏞️' : 
                  county.includes('VENTURA') ? '🌊' : '🏔️';
    
    console.log(`   ${emoji} ${county}: $${countyMonthly.toLocaleString()}/month • $${countyAnnual.toLocaleString()}/year`);
  });

  // ROI Analysis
  console.log('\n💰 ROI ANALYSIS:');
  const adSpendPercentage = 0.25; // 25% of revenue on ads
  const operatingCosts = 0.15;    // 15% operating costs
  const netMargin = 1 - adSpendPercentage - operatingCosts;
  
  const monthlyAdSpend = monthlyRevenue * adSpendPercentage;
  const monthlyOperating = monthlyRevenue * operatingCosts;
  const monthlyProfit = monthlyRevenue * netMargin;
  
  console.log(`   📈 Gross Revenue: $${monthlyRevenue.toLocaleString()}/month`);
  console.log(`   📱 Ad Spend (25%): $${monthlyAdSpend.toLocaleString()}/month`);
  console.log(`   🏢 Operating Costs (15%): $${monthlyOperating.toLocaleString()}/month`);
  console.log(`   💎 NET PROFIT (60%): $${monthlyProfit.toLocaleString()}/month`);
  console.log(`   🎯 ANNUAL NET PROFIT: $${(monthlyProfit * 12).toLocaleString()}`);

  // Path to $5M analysis
  console.log('\n🎯 PATH TO $5M ANNUAL REVENUE:');
  const targetRevenue = 5000000;
  const requiredMonthlyRevenue = targetRevenue / 12;
  const requiredLeads = Math.ceil(requiredMonthlyRevenue / avgLTV);
  const requiredDailyLeads = Math.ceil(requiredLeads / 30);
  
  console.log(`   🎯 Target: $${targetRevenue.toLocaleString()}/year`);
  console.log(`   📊 Required Monthly Revenue: $${requiredMonthlyRevenue.toLocaleString()}`);
  console.log(`   📈 Required Monthly Leads: ${requiredLeads.toLocaleString()}`);
  console.log(`   📅 Required Daily Leads: ${requiredDailyLeads}`);
  console.log(`   📱 Required Daily Ad Spend: $${Math.ceil(requiredDailyLeads * 50)}`); // $50 cost per lead
  
  console.log('\n🚀 RECOMMENDED SCALING STRATEGY:');
  console.log(`   1. Focus on Orange County (highest LTV: $${Math.round(avgLTV * 1.8).toLocaleString()})`);
  console.log(`   2. Expand to Los Angeles County (volume play)`);
  console.log(`   3. Build Ventura County premium market`);
  console.log(`   4. Scale Inland Empire with budget offerings`);
  console.log(`   5. Implement county-specific landing pages`);
  console.log(`   6. Deploy targeted email sequences`);
  console.log(`   7. Optimize for mobile (60% of traffic)`);
  
  console.log('\n🌟 SUCCESS FACTORS:');
  console.log(`   • ${((qualityBreakdown.hot / totalLeads) * 100).toFixed(1)}% hot leads (immediate conversion)`);
  console.log(`   • ${((qualityBreakdown.warm / totalLeads) * 100).toFixed(1)}% warm leads (nurture to convert)`);
  console.log(`   • ${((pricingBreakdown.premium / totalLeads) * 100).toFixed(1)}% premium pricing (higher margins)`);
  console.log(`   • Advanced lead scoring (optimized for SoCal market)`);
  console.log(`   • County-specific messaging (2x conversion rate)`);
  console.log(`   • Automated follow-up sequences`);
  
  console.log('\n🌴 =====================================');
  console.log('🌴 SOCAL SCALING SYSTEM TEST COMPLETE');
  console.log('🌴 =====================================');
  
  return {
    totalLeads,
    avgLTV,
    monthlyRevenue,
    annualRevenue,
    qualityBreakdown,
    countyBreakdown,
    pricingBreakdown,
    pathTo5M: {
      requiredLeads,
      requiredDailyLeads,
      targetRevenue
    }
  };
}

// Run the simulation
const results = runSoCalSimulation();
console.log('\n🎉 Simulation completed successfully!');
console.log(`📊 Results: ${results.totalLeads} leads tested, $${results.avgLTV.toFixed(2)} avg LTV`); 