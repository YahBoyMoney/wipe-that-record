# Email Funnel Automation Setup Guide

## Overview
Your enhanced lead capture system now includes:
- **Lead Scoring**: Automatically scores leads 0-100 based on engagement and data provided
- **Lead Segmentation**: Categorizes leads as Hot (60+), Warm (40-59), Lukewarm (25-39), or Cold (<25)
- **Email Automation**: Triggers different email sequences based on lead data
- **Multi-Platform Integration**: Works with ConvertKit, Mailchimp, and ActiveCampaign

## Lead Scoring System

### Scoring Factors:
- **Base Score**: 10 points for email submission
- **Phone Number**: +15 points (shows higher intent)
- **Conviction Type**: +20 points (serious buyer)
- **Conviction Year**: +10 points (complete data)
- **Time on Site**: +5-15 points based on engagement
- **Pages Viewed**: +5-15 points based on exploration
- **Traffic Source**: +10 points for paid, +5 for organic
- **Lead Magnet**: +15-25 points based on intent level

### Lead Segments:
- **Hot (60+ points)**: Immediate follow-up, high-intent sequences
- **Warm (40-59 points)**: Same-day follow-up, targeted sequences
- **Lukewarm (25-39 points)**: Standard nurture sequences
- **Cold (<25 points)**: Educational content sequences

## Email Service Integrations

### 1. ConvertKit Setup

#### Environment Variables:
```bash
CONVERTKIT_API_KEY=your_api_key_here
CONVERTKIT_GENERAL_FORM_ID=form_id_for_general_nurture
CONVERTKIT_DUI_FORM_ID=form_id_for_dui_specific
CONVERTKIT_MISDEMEANOR_FORM_ID=form_id_for_misdemeanor_specific
CONVERTKIT_CONSULTATION_FORM_ID=form_id_for_consultation_followup
CONVERTKIT_HIGH_INTENT_FORM_ID=form_id_for_high_intent_acceleration
```

#### Setup Steps:
1. Create forms in ConvertKit for each sequence type
2. Set up automation rules for each form
3. Add custom fields for lead scoring data
4. Configure tags for segmentation

### 2. Mailchimp Setup

#### Environment Variables:
```bash
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_AUDIENCE_ID=your_audience_id
MAILCHIMP_DC=us1  # Your data center (us1, us2, etc.)
```

#### Setup Steps:
1. Create audience in Mailchimp
2. Set up merge fields for lead data
3. Create tags for different segments
4. Configure automation workflows

### 3. ActiveCampaign Setup

#### Environment Variables:
```bash
ACTIVECAMPAIGN_API_KEY=your_api_key_here
ACTIVECAMPAIGN_BASE_URL=https://youraccountname.api-us1.com
AC_GENERAL_AUTOMATION_ID=automation_id_for_general
AC_DUI_AUTOMATION_ID=automation_id_for_dui
AC_MISDEMEANOR_AUTOMATION_ID=automation_id_for_misdemeanor
AC_CONSULTATION_AUTOMATION_ID=automation_id_for_consultation
AC_HIGH_INTENT_AUTOMATION_ID=automation_id_for_high_intent
```

#### Setup Steps:
1. Create custom fields for lead scoring
2. Set up automation workflows
3. Configure contact tagging
4. Create segments for different lead types

## Email Sequences

### 1. General Nurture Sequence (Cold/Lukewarm Leads)
- **Day 1**: Welcome + Educational content about expungement
- **Day 3**: Success stories and testimonials
- **Day 7**: Common misconceptions about record clearing
- **Day 14**: DIY vs Professional service comparison
- **Day 21**: Special offer for DIY package
- **Day 30**: Final push with urgency

### 2. DUI-Specific Sequence
- **Day 1**: DUI expungement specifics
- **Day 3**: Employment impact of DUI records
- **Day 7**: DUI success case studies
- **Day 14**: Professional licensing considerations
- **Day 21**: Special DUI package offer

### 3. Misdemeanor-Specific Sequence
- **Day 1**: Misdemeanor expungement process
- **Day 3**: Housing and rental considerations
- **Day 7**: Background check implications
- **Day 14**: Career advancement opportunities
- **Day 21**: Targeted misdemeanor offer

### 4. Consultation Follow-up (High Intent)
- **Immediate**: Thank you + next steps
- **1 Hour**: Consultation booking link
- **24 Hours**: Urgency reminder
- **3 Days**: Alternative DIY option
- **7 Days**: Final follow-up

### 5. High-Intent Acceleration (Hot Leads)
- **Immediate**: Welcome + special offer
- **30 Minutes**: Limited-time discount
- **2 Hours**: Social proof and urgency
- **24 Hours**: Final call to action
- **3 Days**: Fallback to standard nurture

## Data Collection

### Lead Capture Form Collects:
- **Basic Info**: Name, email, phone
- **Case Details**: Conviction type, year, urgency
- **Personalization**: Goals, budget, previous attempts
- **Analytics**: Time on site, pages viewed, device type
- **Attribution**: UTM parameters, referrer, source

### Analytics Tracking:
- Lead score calculation
- Conversion stage tracking
- Email engagement metrics
- Revenue attribution
- Funnel performance

## Implementation Checklist

### Phase 1: Basic Setup
- [ ] Choose email service (ConvertKit recommended)
- [ ] Set up environment variables in Vercel
- [ ] Create basic welcome sequence
- [ ] Test lead capture form

### Phase 2: Segmentation
- [ ] Create segment-specific sequences
- [ ] Set up lead scoring rules
- [ ] Configure automation triggers
- [ ] Test different lead types

### Phase 3: Optimization
- [ ] A/B test email sequences
- [ ] Optimize lead scoring weights
- [ ] Add behavioral triggers
- [ ] Implement advanced segmentation

## Recommended Email Service: ConvertKit

### Why ConvertKit:
- **Easy Automation**: Visual automation builder
- **Tagging System**: Flexible lead segmentation
- **API Integration**: Seamless with your system
- **Landing Pages**: Built-in lead magnets
- **Analytics**: Detailed performance tracking

### ConvertKit Setup Process:
1. **Sign up**: Start with free plan (up to 1,000 subscribers)
2. **Create Forms**: Set up 5 forms for different sequences
3. **Build Sequences**: Create email sequences for each segment
4. **Add Custom Fields**: Track lead scoring data
5. **Set Up Automations**: Connect forms to sequences
6. **Test Integration**: Verify API connection works

## Advanced Features

### Lead Scoring Optimization:
- Track conversion rates by score ranges
- Adjust scoring weights based on performance
- Add behavioral scoring triggers
- Implement decay for inactive leads

### Personalization:
- Dynamic content based on conviction type
- Location-specific messaging
- Urgency-based email timing
- Budget-appropriate offers

### Attribution Tracking:
- UTM parameter capture
- Source attribution
- Campaign performance tracking
- ROI measurement

## Monitoring & Analytics

### Key Metrics:
- **Lead Score Distribution**: Track average scores
- **Conversion Rates**: By segment and sequence
- **Email Performance**: Open rates, click rates
- **Revenue Attribution**: Track from lead to sale
- **Funnel Drop-off**: Identify optimization points

### Dashboard Access:
- Payload CMS admin panel: `/admin/dashboard`
- Lead analytics: `/admin/collections/leads`
- Email performance: Your email service dashboard

## Troubleshooting

### Common Issues:
1. **API Connection Errors**: Check environment variables
2. **Lead Not Scoring**: Verify data collection
3. **Emails Not Sending**: Check service configuration
4. **Segmentation Issues**: Review automation rules

### Testing:
- Use test email addresses
- Check automation triggers
- Verify lead scoring calculation
- Test different form scenarios

## Next Steps

1. **Choose Your Email Service**: ConvertKit recommended
2. **Set Up Environment Variables**: Add to Vercel dashboard
3. **Create Email Sequences**: Start with general nurture
4. **Test Lead Capture**: Submit test leads
5. **Monitor Performance**: Track key metrics
6. **Optimize**: Adjust based on data

Your email funnel is now ready to capture and convert leads automatically! 🚀 