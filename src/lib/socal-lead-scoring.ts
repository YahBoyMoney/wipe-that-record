// Southern California Specific Lead Scoring System
// Optimized for LA, Orange, Riverside, San Bernardino, and Ventura Counties

export interface SoCalLeadData {
  // Basic info
  first: string;
  last: string;
  email: string;
  phone?: string;
  
  // Geographic data
  county: 'los-angeles' | 'orange' | 'riverside' | 'san-bernardino' | 'ventura' | 'other-california' | 'outside-california';
  city?: string;
  zipCode?: string;
  
  // Legal specifics
  convictionType: 'dui' | 'drug-possession' | 'theft' | 'misdemeanor' | 'felony' | 'domestic-violence' | 'other';
  convictionYear?: string;
  convictionCounty?: string;
  hasMultipleConvictions?: boolean;
  hasFailedAttempts?: boolean;
  
  // Economic factors
  urgency: 'immediate' | 'within-month' | 'within-3-months' | 'within-6-months' | 'just-researching';
  employmentStatus: 'employed' | 'seeking-employment' | 'self-employed' | 'student' | 'unemployed';
  industryOfInterest?: 'tech' | 'entertainment' | 'healthcare' | 'finance' | 'education' | 'government' | 'hospitality' | 'other';
  annualIncome?: 'under-30k' | '30k-50k' | '50k-75k' | '75k-100k' | '100k-150k' | '150k+';
  
  // SoCal specific factors
  hasSecurityClearance?: boolean;
  needsHousingAssistance?: boolean;
  inTechIndustry?: boolean;
  inEntertainmentIndustry?: boolean;
  isStudentUCUC?: boolean; // UC/USC/UCLA system
  
  // Marketing attribution
  utmSource?: string;
  utmCampaign?: string;
  referralSource?: string;
}

export function calculateSoCalLeadScore(data: SoCalLeadData): {
  leadScore: number;
  conversionProbability: string;
  leadQuality: 'hot' | 'warm' | 'cold';
  leadSegment: string;
  estimatedLifetimeValue: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  recommendedPricing: 'premium' | 'standard' | 'budget';
  targetedSequence: string;
} {
  let score = 0;
  
  // 🌴 GEOGRAPHIC SCORING (25 points max)
  // Different counties have different success rates and willingness to pay
  switch (data.county) {
    case 'orange':
      score += 25; // Highest income, best conversion rates
      break;
    case 'los-angeles':
      score += 23; // High volume, good rates
      break;
    case 'ventura':
      score += 20; // Smaller but affluent market
      break;
    case 'riverside':
      score += 18; // Growing market, price-sensitive
      break;
    case 'san-bernardino':
      score += 15; // Price-sensitive but high volume
      break;
    case 'other-california':
      score += 10;
      break;
    case 'outside-california':
      score += 0; // Outside our target market
      break;
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
  // Based on SoCal market demand and complexity
  switch (data.convictionType) {
    case 'dui': score += 20; // Highest demand in SoCal
      break;
    case 'drug-possession': score += 18; // Very common, good success rate
      break;
    case 'theft': score += 16; // Common in retail-heavy areas
      break;
    case 'misdemeanor': score += 14; // Easier process, good margins
      break;
    case 'felony': score += 17; // Higher complexity, premium pricing
      break;
    case 'domestic-violence': score += 12; // More complex, lower success
      break;
    case 'other': score += 10;
      break;
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
  if (data.inTechIndustry) score += 5; // Tech workers pay premium
  else if (data.inEntertainmentIndustry) score += 4; // Entertainment industry common
  else if (data.industryOfInterest === 'healthcare') score += 3; // Background checks required
  else if (data.industryOfInterest === 'finance') score += 3; // Background checks required
  else if (data.industryOfInterest === 'government') score += 2; // Security clearances
  
  // 🎓 EDUCATION BONUSES
  if (data.isStudentUCUC) score += 3; // UC system students
  if (data.hasSecurityClearance) score += 3; // Military/defense contractors
  
  // ⚠️ RISK FACTORS
  if (data.hasMultipleConvictions) score -= 5;
  if (data.hasFailedAttempts) score -= 3;
  if (data.county === 'outside-california') score -= 20; // Major penalty
  
  // 📱 CONTACT QUALITY
  if (data.phone) score += 2;
  
  // Calculate derived metrics
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
  
  // County multipliers based on local economics
  if (data.county === 'orange') baseLTV *= 2.2; // Affluent market
  else if (data.county === 'los-angeles') baseLTV *= 1.8;
  else if (data.county === 'ventura') baseLTV *= 1.9;
  else if (data.county === 'riverside') baseLTV *= 1.3;
  else if (data.county === 'san-bernardino') baseLTV *= 1.2;
  
  // Industry multipliers
  if (data.inTechIndustry) baseLTV *= 1.5;
  if (data.inEntertainmentIndustry) baseLTV *= 1.3;
  if (data.hasSecurityClearance) baseLTV *= 1.4;
  
  // Urgency multiplier
  if (data.urgency === 'immediate') baseLTV *= 2.0;
  else if (data.urgency === 'within-month') baseLTV *= 1.6;
  
  const estimatedLifetimeValue = Math.round(baseLTV * (score / 50));
  
  // 🚨 PRIORITY ASSIGNMENT
  const priority = score >= 85 ? 'urgent' : 
                   score >= 70 ? 'high' : 
                   score >= 50 ? 'medium' : 'low';
  
  // 💲 PRICING STRATEGY
  const recommendedPricing = (data.county === 'orange' || data.inTechIndustry || estimatedLifetimeValue > 500) ? 'premium' :
                            (score >= 60) ? 'standard' : 'budget';
  
  // 📧 EMAIL SEQUENCE ASSIGNMENT
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
    leadScore: Math.min(score, 100), // Cap at 100
    conversionProbability,
    leadQuality,
    leadSegment,
    estimatedLifetimeValue,
    priority,
    recommendedPricing,
    targetedSequence
  };
}

// 🗺️ SOCAL COUNTY DATA
export const soCalCountyData = {
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

// 🎯 TARGETING RECOMMENDATIONS
export function getSoCalTargetingRecommendations(leadData: SoCalLeadData) {
  const scoring = calculateSoCalLeadScore(leadData);
  const countyData = soCalCountyData[leadData.county as keyof typeof soCalCountyData];
  
  return {
    ...scoring,
    countyInfo: countyData,
    marketingRecommendations: {
      adSpend: scoring.priority === 'urgent' ? 'high' : scoring.priority === 'high' ? 'medium' : 'low',
      followUpFrequency: scoring.leadQuality === 'hot' ? 'daily' : scoring.leadQuality === 'warm' ? 'every-2-days' : 'weekly',
      personalizedContent: scoring.leadScore >= 70,
      phoneCallRecommended: scoring.leadScore >= 80 && leadData.phone,
      expeditedService: leadData.urgency === 'immediate' && scoring.leadScore >= 75
    }
  };
} 