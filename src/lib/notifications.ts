// 🚨 COMPREHENSIVE NOTIFICATION SYSTEM
// Real-time alerts for form submissions, purchases, and important events

export interface NotificationData {
  type: 'form_submission' | 'purchase' | 'high_value_lead' | 'cart_abandonment' | 'system_alert';
  title: string;
  message: string;
  data: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
}

// 📧 Email Notifications
export async function sendEmailNotification(data: NotificationData) {
  try {
    const { sendAdminNotification } = await import('./email-professional');
    
    await sendAdminNotification(
      data.type === 'purchase' ? 'purchase' : 'form_submission',
      {
        ...data.data,
        notificationTitle: data.title,
        notificationMessage: data.message,
        priority: data.priority
      }
    );
    
    console.log(`✅ Email notification sent: ${data.title}`);
  } catch (error) {
    console.error('❌ Email notification failed:', error);
  }
}

// 💬 Slack Notifications
export async function sendSlackNotification(data: NotificationData) {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.log('⚠️ Slack webhook not configured');
    return;
  }

  try {
    const color = {
      low: '#36a64f',      // Green
      medium: '#ff9500',   // Orange  
      high: '#ff0000',     // Red
      urgent: '#8b0000'    // Dark Red
    }[data.priority];

    const emoji = {
      form_submission: '📝',
      purchase: '💰',
      high_value_lead: '🎯',
      cart_abandonment: '🛒',
      system_alert: '🚨'
    }[data.type];

    const slackPayload = {
      text: `${emoji} ${data.title}`,
      attachments: [
        {
          color: color,
          fields: [
            {
              title: 'Details',
              value: data.message,
              short: false
            },
            {
              title: 'Type',
              value: data.type.replace('_', ' ').toUpperCase(),
              short: true
            },
            {
              title: 'Priority',
              value: data.priority.toUpperCase(),
              short: true
            },
            {
              title: 'Email',
              value: data.data.email || 'Not provided',
              short: true
            },
            {
              title: 'Amount',
              value: data.data.amount ? `$${data.data.amount}` : 'N/A',
              short: true
            }
          ],
          footer: 'Wipe That Record',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };

    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload)
    });

    if (response.ok) {
      console.log(`✅ Slack notification sent: ${data.title}`);
    } else {
      console.error('❌ Slack notification failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ Slack notification error:', error);
  }
}

// 🎮 Discord Notifications
export async function sendDiscordNotification(data: NotificationData) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log('⚠️ Discord webhook not configured');
    return;
  }

  try {
    const color = {
      low: 0x36a64f,      // Green
      medium: 0xff9500,   // Orange
      high: 0xff0000,     // Red
      urgent: 0x8b0000    // Dark Red
    }[data.priority];

    const emoji = {
      form_submission: '📝',
      purchase: '💰',
      high_value_lead: '🎯',
      cart_abandonment: '🛒',
      system_alert: '🚨'
    }[data.type];

    const discordPayload = {
      embeds: [
        {
          title: `${emoji} ${data.title}`,
          description: data.message,
          color: color,
          fields: [
            {
              name: 'Email',
              value: data.data.email || 'Not provided',
              inline: true
            },
            {
              name: 'Amount',
              value: data.data.amount ? `$${data.data.amount}` : 'N/A',
              inline: true
            },
            {
              name: 'Priority',
              value: data.priority.toUpperCase(),
              inline: true
            }
          ],
          timestamp: data.timestamp,
          footer: {
            text: 'Wipe That Record Notifications'
          }
        }
      ]
    };

    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (response.ok) {
      console.log(`✅ Discord notification sent: ${data.title}`);
    } else {
      console.error('❌ Discord notification failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ Discord notification error:', error);
  }
}

// 📱 SMS Notifications (for urgent alerts)
export async function sendSMSNotification(data: NotificationData) {
  if (!process.env.TWILIO_ACCOUNT_SID || data.priority !== 'urgent') {
    return; // Only send SMS for urgent notifications
  }

  try {
    const message = `${data.title}: ${data.message}. Email: ${data.data.email}${data.data.amount ? `, Amount: $${data.data.amount}` : ''}`;
    
    // Here you would integrate with Twilio or another SMS service
    console.log(`📱 SMS would be sent: ${message}`);
    
    // Uncomment when Twilio is configured:
    /*
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    await twilio.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ADMIN_PHONE_NUMBER
    });
    
    console.log(`✅ SMS notification sent: ${data.title}`);
    */
  } catch (error) {
    console.error('❌ SMS notification failed:', error);
  }
}

// 🔔 Master Notification Function
export async function sendNotification(data: NotificationData) {
  console.log(`🔔 Sending notification: ${data.title} (Priority: ${data.priority})`);
  
  // Send notifications in parallel for better performance
  const notifications = [];
  
  // Always send email notifications
  notifications.push(sendEmailNotification(data));
  
  // Send Slack if configured
  if (process.env.SLACK_WEBHOOK_URL) {
    notifications.push(sendSlackNotification(data));
  }
  
  // Send Discord if configured  
  if (process.env.DISCORD_WEBHOOK_URL) {
    notifications.push(sendDiscordNotification(data));
  }
  
  // Send SMS for urgent notifications
  if (data.priority === 'urgent') {
    notifications.push(sendSMSNotification(data));
  }
  
  try {
    await Promise.all(notifications);
    console.log(`✅ All notifications sent for: ${data.title}`);
  } catch (error) {
    console.error('❌ Some notifications failed:', error);
  }
}

// 🎯 Specific Notification Helpers
export async function notifyFormSubmission(leadData: any) {
  await sendNotification({
    type: 'form_submission',
    title: 'New Lead Captured',
    message: `${leadData.fullName || leadData.email} submitted the qualification form. Lead Score: ${leadData.leadScore}/100, Segment: ${leadData.leadSegment}`,
    data: leadData,
    priority: leadData.leadScore >= 70 ? 'high' : leadData.leadScore >= 45 ? 'medium' : 'low',
    timestamp: new Date().toISOString()
  });
}

export async function notifyPurchase(purchaseData: any) {
  await sendNotification({
    type: 'purchase',
    title: 'New Purchase Completed',
    message: `${purchaseData.fullName || purchaseData.email} purchased ${purchaseData.product} for $${purchaseData.amount}`,
    data: purchaseData,
    priority: purchaseData.amount >= 1000 ? 'urgent' : purchaseData.amount >= 100 ? 'high' : 'medium',
    timestamp: new Date().toISOString()
  });
}

export async function notifyHighValueLead(leadData: any) {
  await sendNotification({
    type: 'high_value_lead',
    title: 'High-Value Lead Detected',
    message: `${leadData.email} is a high-value prospect (Score: ${leadData.leadScore}/100) with immediate urgency. Consider personal outreach.`,
    data: leadData,
    priority: 'urgent',
    timestamp: new Date().toISOString()
  });
}

export async function notifyCartAbandonment(leadData: any) {
  await sendNotification({
    type: 'cart_abandonment',
    title: 'Cart Abandonment Alert',
    message: `${leadData.email} started checkout but didn't complete. Potential value: $${leadData.estimatedValue || 50}`,
    data: leadData,
    priority: 'medium',
    timestamp: new Date().toISOString()    
  });
} 