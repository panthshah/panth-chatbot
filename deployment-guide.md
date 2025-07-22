# 🚀 Deploy Your Chatbot to Vercel

## Quick Deployment Steps:

### 1. **Push to GitHub**
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial chatbot setup"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/panth-chatbot.git
git push -u origin main
```

### 2. **Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `panth-chatbot` repository
5. Add environment variable: `OPENAI_API_KEY` = your API key
6. Deploy!

### 3. **Get Your API Endpoint**
After deployment, you'll get a URL like:
`https://panth-chatbot-xyz.vercel.app`

Your API endpoint will be:
`https://panth-chatbot-xyz.vercel.app/api/chat`

---

## Alternative: Use Our Current Running Version

For testing, you can use: `http://localhost:3000/api/chat`
(But this only works while your local server is running) 