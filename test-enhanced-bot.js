/**
 * Enhanced Telegram Business Bot - Test Suite
 * Tests all security features, commands, and integrations
 */

const https = require('https');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
const STORE_PROVIDER = process.env.STORE_PROVIDER || 'woo';

console.log(' Enhanced Telegram Business Bot - Test Suite');
console.log('='.repeat(60));
