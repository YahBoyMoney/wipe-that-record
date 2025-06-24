import { NextRequest, NextResponse } from 'next/server';

// 💰 REAL WORKING PROMO CODES SYSTEM
// Validates codes, applies discounts, tracks usage

interface PromoCode {
  code: string;
  discount: number; // percentage
  type: 'percentage' | 'fixed';
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  validUntil?: Date;
  active: boolean;
  description: string;
  targetProduct?: 'diy' | 'review' | 'full-service' | 'all';
}

// 🔥 ACTIVE PROMO CODES DATABASE
const PROMO_CODES: Record<string, PromoCode> = {
  'SAVE10': {
    code: 'SAVE10',
    discount: 10,
    type: 'percentage',
    usedCount: 0,
    active: true,
    description: 'Save 10% on any service',
    targetProduct: 'all'
  },
  'SAVE20': {
    code: 'SAVE20', 
    discount: 20,
    type: 'percentage',
    usedCount: 0,
    active: true,
    description: 'Save 20% on any service',
    targetProduct: 'all'
  },
  'SAVE30': {
    code: 'SAVE30',
    discount: 30,
    type: 'percentage',
    usedCount: 0,
    active: true,
    description: 'Save 30% on any service',
    targetProduct: 'all'
  },
  'URGENT50': {
    code: 'URGENT50',
    discount: 50,
    type: 'percentage',
    maxUses: 50,
    usedCount: 0,
    validUntil: new Date('2025-12-31'),
    active: true,
    description: '🚨 URGENT: 50% OFF Limited Time',
    targetProduct: 'all'
  },
  'NEWSTART25': {
    code: 'NEWSTART25',
    discount: 25,
    type: 'percentage',
    usedCount: 0,
    active: true,
    description: '🎯 Fresh Start: 25% OFF Your New Beginning',
    targetProduct: 'all'
  },
  'LASTCHANCE30': {
    code: 'LASTCHANCE30',
    discount: 30,
    type: 'percentage',
    maxUses: 100,
    usedCount: 0,
    validUntil: new Date('2025-12-31'),
    active: true,
    description: '⏰ LAST CHANCE: 30% OFF Before Price Increase',
    targetProduct: 'all'
  },
  'DIY40': {
    code: 'DIY40',
    discount: 40,
    type: 'percentage',
    usedCount: 0,
    active: true,
    description: '💰 DIY Special: 40% OFF Self-Service Package',
    targetProduct: 'diy'
  },
  'UPGRADE25': {
    code: 'UPGRADE25',
    discount: 25,
    type: 'percentage',
    usedCount: 0,
    active: true,
    description: '⬆️ Upgrade Discount: 25% OFF Review Service',
    targetProduct: 'review'
  },
  'VIP20': {
    code: 'VIP20',
    discount: 20,
    type: 'percentage',
    minAmount: 1000,
    usedCount: 0,
    active: true,
    description: '👑 VIP Discount: 20% OFF Full Service',
    targetProduct: 'full-service'
  },
  'FLASH50': {
    code: 'FLASH50',
    discount: 50,
    type: 'percentage',
    maxUses: 25,
    usedCount: 0,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    active: true,
    description: '⚡ FLASH SALE: 50% OFF Next 24 Hours Only',
    targetProduct: 'all'
  }
};

// GET: Validate promo code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.toUpperCase();
    const amount = parseFloat(searchParams.get('amount') || '0');
    const product = searchParams.get('product') || 'all';

    if (!code) {
      return NextResponse.json({ 
        error: 'Promo code required' 
      }, { status: 400 });
    }

    console.log(`🔍 Validating promo code: ${code} for $${amount} ${product}`);

    const promoCode = PROMO_CODES[code];
    
    if (!promoCode) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid promo code'
      }, { status: 404 });
    }

    // Check if code is active
    if (!promoCode.active) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code is no longer active'
      }, { status: 400 });
    }

    // Check expiration
    if (promoCode.validUntil && new Date() > promoCode.validUntil) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code has expired'
      }, { status: 400 });
    }

    // Check usage limit
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code usage limit reached'
      }, { status: 400 });
    }

    // Check minimum amount
    if (promoCode.minAmount && amount < promoCode.minAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount $${promoCode.minAmount} required`
      }, { status: 400 });
    }

    // Check product compatibility
    if (promoCode.targetProduct && promoCode.targetProduct !== 'all' && promoCode.targetProduct !== product) {
      return NextResponse.json({
        valid: false,
        error: `This promo code is only valid for ${promoCode.targetProduct} service`
      }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.type === 'percentage') {
      discountAmount = (amount * promoCode.discount) / 100;
    } else {
      discountAmount = promoCode.discount;
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    console.log(`✅ Promo code valid: ${code} - $${discountAmount} discount`);

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discount: promoCode.discount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
      description: promoCode.description,
      type: promoCode.type,
      remainingUses: promoCode.maxUses ? promoCode.maxUses - promoCode.usedCount : null
    });

  } catch (error) {
    console.error('❌ Promo code validation error:', error);
    return NextResponse.json({ 
      error: 'Failed to validate promo code'
    }, { status: 500 });
  }
}

// POST: Apply promo code (increment usage)
export async function POST(req: NextRequest) {
  try {
    const { code, amount, product, email } = await req.json();
    
    if (!code) {
      return NextResponse.json({ 
        error: 'Promo code required' 
      }, { status: 400 });
    }

    const upperCode = code.toUpperCase();
    console.log(`🎯 Applying promo code: ${upperCode} for ${email}`);

    const promoCode = PROMO_CODES[upperCode];
    
    if (!promoCode) {
      return NextResponse.json({
        success: false,
        error: 'Invalid promo code'
      }, { status: 404 });
    }

    // Validate again before applying
    const validationResult = await validatePromoCode(promoCode, amount, product);
    if (!validationResult.valid) {
      return NextResponse.json({
        success: false,
        error: validationResult.error
      }, { status: 400 });
    }

    // Apply the promo code (increment usage)
    PROMO_CODES[upperCode].usedCount++;

    // Calculate final amounts
    let discountAmount = 0;
    if (promoCode.type === 'percentage') {
      discountAmount = (amount * promoCode.discount) / 100;
    } else {
      discountAmount = promoCode.discount;
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    console.log(`✅ Promo code applied: ${upperCode} - Discount: $${discountAmount}`);

    // Log usage for analytics
    console.log(`📊 Promo code usage: ${upperCode} used ${promoCode.usedCount} times`);

    return NextResponse.json({
      success: true,
      applied: true,
      code: promoCode.code,
      discount: promoCode.discount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
      originalAmount: amount,
      description: promoCode.description,
      usageCount: promoCode.usedCount
    });

  } catch (error) {
    console.error('❌ Promo code application error:', error);
    return NextResponse.json({ 
      error: 'Failed to apply promo code'
    }, { status: 500 });
  }
}

// Helper function to validate promo code
function validatePromoCode(promoCode: PromoCode, amount: number, product: string) {
  if (!promoCode.active) {
    return { valid: false, error: 'Promo code is no longer active' };
  }

  if (promoCode.validUntil && new Date() > promoCode.validUntil) {
    return { valid: false, error: 'Promo code has expired' };
  }

  if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
    return { valid: false, error: 'Promo code usage limit reached' };
  }

  if (promoCode.minAmount && amount < promoCode.minAmount) {
    return { valid: false, error: `Minimum order amount $${promoCode.minAmount} required` };
  }

  if (promoCode.targetProduct && promoCode.targetProduct !== 'all' && promoCode.targetProduct !== product) {
    return { valid: false, error: `This promo code is only valid for ${promoCode.targetProduct} service` };
  }

  return { valid: true };
} 