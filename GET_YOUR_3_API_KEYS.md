# 🔑 GET YOUR 3 MISSING API KEYS

Your .env.local file is ready! You just need to replace these 3 placeholders:

## 1. 🤖 TELEGRAM BOT TOKEN

**Step 1:** Open Telegram app on your phone/computer

**Step 2:** Search for: `@BotFather`

**Step 3:** Start a chat and send: `/newbot`

**Step 4:** Follow the prompts:
- Bot name: `WipeThatRecord AI Sales Bot` 
- Username: `WipeRecordBot` (or similar, must end with 'bot')

**Step 5:** Copy the token that looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

**Step 6:** In your .env.local file, replace:
```
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
```
with:
```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

## 2. 📱 YOUR TELEGRAM CHAT ID

**Step 1:** In Telegram, search for: `@userinfobot`

**Step 2:** Start a chat and send any message (like "hi")

**Step 3:** It will reply with your user info. Copy the ID number (like: `987654321`)

**Step 4:** In your .env.local file, replace:
```
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE
```
with:
```
TELEGRAM_CHAT_ID=987654321
```

## 3. 🧠 OPENAI API KEY

**Step 1:** Go to: https://platform.openai.com/api-keys

**Step 2:** Sign in to your OpenAI account (create one if needed)

**Step 3:** Click "Create new secret key"

**Step 4:** Name it "WipeThatRecord Bot" 

**Step 5:** Copy the API key that starts with: `sk-`

**Step 6:** In your .env.local file, replace:
```
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
```
with:
```
OPENAI_API_KEY=your-openai-api-key-here
```

## 4. 🧪 TEST YOUR SETUP

After adding all 3 keys, run:
```bash
node test-telegram-bot.cjs
```

You should see:
```
✅ All required environment variables are set
✅ Bot connected: @WipeRecordBot
✅ Test message sent successfully!
```

## 5. 🌐 SET WEBHOOK

Replace `YOUR_BOT_TOKEN` with your actual bot token:
```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://wipethatrecord.com/api/telegram-bot"
```

## 6. 🎉 TEST ON TELEGRAM

1. Find your bot on Telegram (search for your bot username)
2. Send: `/start`
3. Try: `/insights` (AI business analysis)
4. Ask: "How can I increase revenue?"

Your bot will now give you AI-powered business insights! 🚀 