import { NextRequest, NextResponse } from 'next/server';
import { sendNotification, notifyFormSubmission, notifyPurchase, notifyHighValueLead } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const { type, data, test } = await req.json();
    
    // Test notification endpoint
    if (test) {
      console.log('🧪 Testing notification system...');
      
      await sendNotification({
        type: 'system_alert',
        title: 'Notification System Test',
        message: 'This is a test notification to verify all systems are working correctly.',
        data: { test: true, timestamp: new Date().toISOString() },
        priority: 'medium',
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Test notification sent successfully!' 
      });
    }
    
    // Handle different notification types
    switch (type) {
      case 'form_submission':
        await notifyFormSubmission(data);
        break;
        
      case 'purchase':
        await notifyPurchase(data);
        break;
        
      case 'high_value_lead':
        await notifyHighValueLead(data);
        break;
        
      default:
        return NextResponse.json({ 
          error: 'Invalid notification type' 
        }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${type} notification sent successfully` 
    });
    
  } catch (error) {
    console.error('❌ Notification API error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to send notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const test = searchParams.get('test');
  
  if (test) {
    try {
      // Send test notifications to all configured channels
      await sendNotification({
        type: 'system_alert',
        title: '🧪 Notification System Health Check',
        message: 'All notification channels are working correctly. This test was triggered via GET request.',
        data: { 
          test: true, 
          method: 'GET',
          timestamp: new Date().toISOString(),
          channels: {
            email: !!process.env.RESEND_API_KEY,
            slack: !!process.env.SLACK_WEBHOOK_URL,
            discord: !!process.env.DISCORD_WEBHOOK_URL,
            sms: !!process.env.TWILIO_ACCOUNT_SID
          }
        },
        priority: 'low',
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'Test notification sent successfully!',
        channels: {
          email: !!process.env.RESEND_API_KEY ? 'configured' : 'not configured',
          slack: !!process.env.SLACK_WEBHOOK_URL ? 'configured' : 'not configured', 
          discord: !!process.env.DISCORD_WEBHOOK_URL ? 'configured' : 'not configured',
          sms: !!process.env.TWILIO_ACCOUNT_SID ? 'configured' : 'not configured'
        }
      });
      
    } catch (error) {
      return NextResponse.json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }
  
  return NextResponse.json({ 
    message: 'Notification API is running. Use ?test=true to send a test notification.' 
  });
} 