# Deployment Guide - Planning Poker

Your Planning Poker app is ready to deploy! It's a static React app that connects to Firebase, so you can host it for **FREE** on several platforms.

## 🎯 Recommended: Vercel (Easiest)

Vercel is the easiest and most reliable option for React apps.

### Option 1: Vercel Dashboard (No CLI needed)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"
   - Done! ✅

3. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all your Firebase config variables from `.env`:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
   - Redeploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Production deployment
vercel --prod
```

---

## 🔥 Firebase Hosting (Best Integration)

Since you're already using Firebase, this provides the best integration.

### Setup Steps

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**

   ```bash
   firebase login
   ```

3. **Initialize Hosting**

   ```bash
   firebase init hosting
   ```

   Select:

   - Use existing project (select your Firebase project)
   - Public directory: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds with GitHub: `No` (or `Yes` if you want)
   - Overwrite index.html: `No`

4. **Build Your App**

   ```bash
   npm run build
   ```

5. **Deploy**

   ```bash
   firebase deploy --only hosting
   ```

6. **Your app is live!**
   - URL: `https://YOUR_PROJECT_ID.web.app`
   - Or: `https://YOUR_PROJECT_ID.firebaseapp.com`

### Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS setup instructions

---

## 🌐 Netlify

Another great free option with drag-and-drop deployment.

### Option 1: Drag & Drop

1. **Build your app**

   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to [netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder
   - Done! ✅

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Add Environment Variables

1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Add all your `VITE_FIREBASE_*` variables
4. Redeploy

---

## ⚙️ Important: Environment Variables

**All platforms need your Firebase config!**

Make sure to add these environment variables in your hosting platform:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Never commit your `.env` file to Git!** (It's already in `.gitignore`)

---

## 🔗 Shareable Links Work Everywhere!

Your room joining links (e.g., `https://yourapp.com/?room=ABC123`) will work on **all platforms** because:

- It's a single-page React app
- All platforms support URL parameters
- The routing is handled client-side

---

## 📊 Free Tier Limits

| Platform     | Bandwidth   | Build Minutes | Custom Domain |
| ------------ | ----------- | ------------- | ------------- |
| **Vercel**   | 100GB/month | Unlimited     | ✅ Free       |
| **Firebase** | 360MB/day   | N/A           | ✅ Free       |
| **Netlify**  | 100GB/month | 300 min/month | ✅ Free       |

All are more than enough for your Planning Poker app! 🎉

---

## 🚀 Quick Start (Vercel - Recommended)

```bash
# 1. Install Vercel
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow prompts
# 4. Done! Your app is live! 🎉
```

---

## 🎯 Post-Deployment Checklist

- [ ] App loads correctly
- [ ] Can create rooms
- [ ] Can join rooms via link
- [ ] Real-time voting works
- [ ] Reveal functionality works
- [ ] Footer LinkedIn link works
- [ ] Logo displays correctly

---

## 🐛 Troubleshooting

**Issue: Blank page after deployment**

- Check browser console for errors
- Verify environment variables are set
- Check Firebase security rules

**Issue: Can't create/join rooms**

- Verify Firebase config is correct
- Check Firestore security rules are deployed
- Ensure authentication is enabled in Firebase Console

**Issue: 404 on refresh**

- Make sure SPA mode is enabled (all platforms handle this differently)
- Vercel/Netlify: Should work automatically
- Firebase: Make sure you selected "single-page app" during init

---

## 📝 Notes

- Your app is **100% free to host** on any of these platforms
- Firebase backend is also **free** (Spark plan)
- No server needed - it's all static files + Firebase
- Scales automatically with all platforms

**Enjoy your deployed Planning Poker app! 🎉**
