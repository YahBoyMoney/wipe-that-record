'use client';

// Generate or get session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('wtr_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('wtr_session_id', sessionId);
  }
  return sessionId;
};

// Generate or get user ID
const getUserId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('wtr_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('wtr_user_id', userId);
  }
  return userId;
};

// Get UTM parameters
const getUTMParams = () => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
  };
};

interface TrackEventOptions {
  event: string;
  page?: string;
  product_id?: string;
  value?: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export const trackEvent = async (options: TrackEventOptions) => {
  if (typeof window === 'undefined') return;

  try {
    const data = {
      ...options,
      page: options.page || window.location.pathname,
      session_id: getSessionId(),
      user_id: getUserId(),
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...getUTMParams(),
    };

    // Send to our analytics API
    await fetch('/api/track-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Also send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', options.event, {
        page_location: window.location.href,
        page_title: document.title,
        value: options.value,
        currency: options.currency || 'USD',
        custom_parameters: options.metadata,
      });
    }

  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Specific tracking functions
export const trackPageView = (page?: string) => {
  trackEvent({
    event: 'page_view',
    page: page || window.location.pathname,
  });
};

export const trackProductView = (productId: string, productName?: string, price?: number) => {
  trackEvent({
    event: 'product_view',
    product_id: productId,
    value: price,
    metadata: {
      product_name: productName,
    },
  });
};

export const trackAddToCart = (productId: string, value: number, productName?: string) => {
  trackEvent({
    event: 'add_to_cart',
    product_id: productId,
    value,
    metadata: {
      product_name: productName,
    },
  });
};

export const trackPurchase = (
  productId: string,
  value: number,
  orderId?: string,
  productName?: string
) => {
  trackEvent({
    event: 'purchase',
    product_id: productId,
    value,
    metadata: {
      order_id: orderId,
      product_name: productName,
    },
  });
};

export const trackLeadCapture = (email: string, source?: string) => {
  trackEvent({
    event: 'lead_capture',
    metadata: {
      email,
      source,
    },
  });
};

export const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
  trackEvent({
    event: 'form_submission',
    metadata: {
      form_name: formName,
      form_data: formData,
    },
  });
};

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent({
    event: 'button_click',
    metadata: {
      button_name: buttonName,
      location,
    },
  });
};

// SEO and performance tracking
export const trackSEOMetrics = () => {
  if (typeof window === 'undefined') return;

  // Track page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    trackEvent({
      event: 'page_load_time',
      value: Math.round(loadTime),
      metadata: {
        timing: performance.timing,
      },
    });
  });

  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackEvent({
          event: 'scroll_depth',
          value: maxScroll,
        });
      }
    }
  });

  // Track time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent({
      event: 'time_on_page',
      value: timeOnPage,
    });
  });
};

// Initialize analytics tracking
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  // Track initial page view
  trackPageView();
  
  // Set up SEO metrics tracking
  trackSEOMetrics();

  // Track outbound links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    if (link && link.href && !link.href.includes(window.location.hostname)) {
      trackEvent({
        event: 'outbound_click',
        metadata: {
          url: link.href,
          text: link.textContent,
        },
      });
    }
  });
};

declare global {
  function gtag(...args: any[]): void;
}