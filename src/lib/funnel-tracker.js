// 🎯 AGGRESSIVE FUNNEL TRACKER
// Frontend script to track user behavior and trigger email sequences

class FunnelTracker {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || '/api/email-trigger';
    this.leadData = options.leadData || {};
    this.behaviorData = {
      startTime: Date.now(),
      pageViews: 0,
      timeOnSite: 0,
      scrollDepth: 0,
      clickThroughs: 0,
      pricePageVisits: 0,
      checkoutAttempts: 0,
      emailOpens: 0,
      abandoned: false
    };
    
    this.init();
  }

  init() {
    this.trackPageView();
    this.trackScrollDepth();
    this.trackTimeOnSite();
    this.trackClicks();
    this.trackCheckoutBehavior();
    this.trackPageExit();
    
    console.log('🎯 Funnel Tracker initialized');
  }

  // 📊 PAGE VIEW TRACKING
  trackPageView() {
    this.behaviorData.pageViews++;
    
    // Track pricing page visits
    if (window.location.pathname.includes('pricing') || 
        window.location.pathname.includes('price')) {
      this.behaviorData.pricePageVisits++;
      
      // Trigger price shopping behavior after 3 visits
      if (this.behaviorData.pricePageVisits >= 3) {
        this.triggerEmail('price_check');
      }
    }
    
    // Track services pages
    if (window.location.pathname.includes('service')) {
      this.behaviorData.servicesPageVisits++;
    }
  }

  // 📏 SCROLL DEPTH TRACKING
  trackScrollDepth() {
    let maxScroll = 0;
    
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.behaviorData.scrollDepth = maxScroll;
        
        // High engagement trigger at 80% scroll
        if (maxScroll >= 80 && !this.behaviorData.highEngagementTriggered) {
          this.behaviorData.highEngagementTriggered = true;
          this.checkHighEngagement();
        }
      }
    });
  }

  // ⏰ TIME ON SITE TRACKING
  trackTimeOnSite() {
    setInterval(() => {
      this.behaviorData.timeOnSite = Date.now() - this.behaviorData.startTime;
      
      // Trigger after 5 minutes of browsing
      if (this.behaviorData.timeOnSite > 300000 && !this.behaviorData.timeTriggered) {
        this.behaviorData.timeTriggered = true;
        this.checkHighEngagement();
      }
    }, 10000); // Check every 10 seconds
  }

  // 🖱️ CLICK TRACKING
  trackClicks() {
    document.addEventListener('click', (e) => {
      // Track CTA clicks
      if (e.target.matches('[data-track="cta"]') || 
          e.target.matches('.btn-primary') ||
          e.target.textContent.includes('Get Started') ||
          e.target.textContent.includes('Start Now')) {
        
        this.behaviorData.clickThroughs++;
        this.checkHighEngagement();
      }
      
      // Track pricing clicks
      if (e.target.textContent.includes('$') || 
          e.target.closest('[data-price]')) {
        this.behaviorData.pricingClicks++;
      }
    });
  }

  // 🛒 CHECKOUT BEHAVIOR TRACKING
  trackCheckoutBehavior() {
    // Detect checkout page
    if (window.location.pathname.includes('checkout') || 
        window.location.pathname.includes('payment')) {
      
      this.behaviorData.startedCheckout = true;
      this.behaviorData.checkoutStartTime = Date.now();
      
      console.log('🛒 Checkout started - tracking abandonment');
      
      // Set abandonment timer (3 minutes)
      this.abandonmentTimer = setTimeout(() => {
        if (!this.behaviorData.completed) {
          this.behaviorData.abandoned = true;
          this.triggerEmail('cart_abandon');
        }
      }, 180000); // 3 minutes
    }
    
    // Track form completion
    const checkoutForms = document.querySelectorAll('form[data-checkout]');
    checkoutForms.forEach(form => {
      form.addEventListener('submit', () => {
        this.behaviorData.completed = true;
        clearTimeout(this.abandonmentTimer);
        console.log('✅ Checkout completed');
      });
    });
  }

  // 🚪 PAGE EXIT TRACKING
  trackPageExit() {
    let exitTriggered = false;
    
    // Mouse leave detection (exit intent)
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitTriggered) {
        exitTriggered = true;
        this.handleExitIntent();
      }
    });
    
    // Before unload
    window.addEventListener('beforeunload', () => {
      this.updateLeadBehavior();
    });
  }

  // 🎯 HIGH ENGAGEMENT CHECK
  checkHighEngagement() {
    const { clickThroughs, timeOnSite, scrollDepth, pageViews } = this.behaviorData;
    
    // High engagement criteria
    if ((clickThroughs >= 2 && timeOnSite > 120000) || // 2+ clicks + 2+ minutes
        (scrollDepth >= 80 && pageViews >= 3) ||       // Deep scroll + multiple pages
        (timeOnSite > 300000)) {                       // 5+ minutes on site
      
      if (!this.behaviorData.highEngagementTriggered) {
        this.behaviorData.highEngagementTriggered = true;
        this.triggerEmail('high_engagement');
      }
    }
  }

  // 🚨 EXIT INTENT HANDLER
  handleExitIntent() {
    console.log('🚨 Exit intent detected');
    
    // Don't trigger if already converted or triggered
    if (this.behaviorData.completed || this.behaviorData.exitIntentTriggered) {
      return;
    }
    
    this.behaviorData.exitIntentTriggered = true;
    
    // Show exit intent popup (optional)
    if (window.showExitIntentPopup) {
      window.showExitIntentPopup();
    }
    
    // Trigger urgency email
    this.triggerEmail('exit_intent');
  }

  // 📧 TRIGGER EMAIL SEQUENCES
  async triggerEmail(action) {
    if (!this.leadData.email) {
      console.log('❌ No email found for trigger:', action);
      return;
    }
    
    console.log(`🚀 Triggering email for action: ${action}`);
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.leadData.email,
          name: this.leadData.name || 'there',
          leadId: this.leadData.leadId,
          action: action,
          leadData: this.leadData,
          behaviorData: this.behaviorData
        })
      });
      
      const result = await response.json();
      console.log(`✅ Email trigger result:`, result);
      
    } catch (error) {
      console.error(`❌ Failed to trigger ${action} email:`, error);
    }
  }

  // 💾 UPDATE LEAD BEHAVIOR
  async updateLeadBehavior() {
    if (!this.leadData.leadId) return;
    
    try {
      await fetch('/api/update-lead-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: this.leadData.leadId,
          behaviorData: this.behaviorData
        })
      });
    } catch (error) {
      console.error('❌ Failed to update lead behavior:', error);
    }
  }

  // 🎪 A/B TEST VARIATIONS
  getEmailVariation(type = 'urgency') {
    const variations = {
      urgency: [
        "⚠️ Your criminal record is costing you $50K/year",
        "🚨 Last chance: Clear your record in 30 days", 
        "⏰ URGENT: Your background check is about to fail again"
      ],
      social_proof: [
        "🏆 How 2,847 Californians cleared their records",
        "✅ Same result that worked for Maria, Marcus, and Sarah",
        "🎯 Join the 94% who got approved this month"
      ],
      value: [
        "💰 $50 solution vs $60,000 problem",
        "🎁 Get $1500 results for just $50",
        "💡 The $50 secret lawyers don't want you to know"
      ]
    };
    
    const options = variations[type] || variations.urgency;
    return options[Math.floor(Math.random() * options.length)];
  }

  // 📊 GET ANALYTICS
  getAnalytics() {
    return {
      timeOnSite: this.behaviorData.timeOnSite,
      pageViews: this.behaviorData.pageViews,
      scrollDepth: this.behaviorData.scrollDepth,
      clickThroughs: this.behaviorData.clickThroughs,
      engagement: this.calculateEngagementScore(),
      triggered: {
        highEngagement: this.behaviorData.highEngagementTriggered,
        cartAbandonment: this.behaviorData.abandoned,
        exitIntent: this.behaviorData.exitIntentTriggered
      }
    };
  }

  calculateEngagementScore() {
    const { timeOnSite, pageViews, scrollDepth, clickThroughs } = this.behaviorData;
    
    let score = 0;
    score += Math.min(timeOnSite / 60000, 10); // Max 10 points for time (minutes)
    score += Math.min(pageViews * 2, 10);      // Max 10 points for page views
    score += Math.min(scrollDepth / 10, 10);   // Max 10 points for scroll depth
    score += Math.min(clickThroughs * 5, 20);  // Max 20 points for clicks
    
    return Math.round(score);
  }
}

// 🚀 AUTO-INITIALIZE IF LEAD DATA EXISTS
window.addEventListener('DOMContentLoaded', () => {
  // Check for lead data in localStorage or data attributes
  const leadData = window.leadData || 
                   JSON.parse(localStorage.getItem('leadData') || '{}') ||
                   {};
  
  if (leadData.email) {
    window.funnelTracker = new FunnelTracker({ leadData });
    console.log('🎯 Funnel tracking active for:', leadData.email);
  }
});

// Export for manual initialization
window.FunnelTracker = FunnelTracker; 