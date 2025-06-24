import { NextRequest, NextResponse } from 'next/server';
import { triggerBehavioralEmail, behaviorTriggers, optimizeEmailTiming } from '../../../lib/email-automation';

export async function POST(req: NextRequest) {
  try {
    console.log('🎯 Email trigger API called');
    
    const { 
      email, 
      name, 
      leadId,
      action, 
      leadData, 
      behaviorData 
    } = await req.json();
    
    if (!email || !leadData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    console.log(`🔍 Processing trigger for ${email}, action: ${action}`);
    
    // Find matching behavioral trigger
    const trigger = behaviorTriggers.find(t => 
      t.condition(leadData, { ...behaviorData, action })
    );
    
    if (!trigger) {
      console.log(`❌ No trigger matches for action: ${action}`);
      return NextResponse.json({ 
        success: false, 
        message: 'No matching trigger found' 
      }, { status: 200 });
    }
    
    console.log(`✅ Found trigger: ${trigger.name} (priority: ${trigger.priority})`);
    
    // Optimize timing based on lead data
    const delay = optimizeEmailTiming(leadData);
    
    // Trigger the behavioral email sequence
    setTimeout(() => {
      triggerBehavioralEmail(
        email,
        name,
        trigger.sequence,
        leadData,
        behaviorData
      );
    }, delay);
    
    console.log(`🚀 Scheduled ${trigger.name} email for ${email} (delay: ${delay}ms)`);
    
    return NextResponse.json({ 
      success: true,
      trigger: trigger.name,
      sequence: trigger.sequence,
      priority: trigger.priority,
      scheduledDelay: delay
    });
    
  } catch (error) {
    console.error('❌ Email trigger error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to trigger email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to check available triggers
export async function GET(req: NextRequest) {
  try {
    const triggers = behaviorTriggers.map(t => ({
      name: t.name,
      sequence: t.sequence,
      priority: t.priority,
      delayMinutes: t.delay
    }));
    
    return NextResponse.json({ 
      triggers,
      totalTriggers: triggers.length 
    });
    
  } catch (error) {
    console.error('❌ Error fetching triggers:', error);
    
    return NextResponse.json({ 
      error: 'Failed to fetch triggers'
    }, { status: 500 });
  }
} 