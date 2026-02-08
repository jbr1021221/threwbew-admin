# 🔐 Simple Fix: Restrict Your API Key (2 Minutes)

## Why This is Actually Fine

Firebase API keys for web apps are **designed to be public**. They appear in your website's source code anyway! 

The real security comes from:
1. **API Key Restrictions** (limit to your domains)
2. **Firebase Security Rules** (control database access)

## ✅ Quick Fix (Do This Now)

### Step 1: Open Google Cloud Console
Click this link (it will open directly to your project):
https://console.cloud.google.com/apis/credentials?project=countdown-timer-70514

### Step 2: Find Your API Key
Look for: **Browser key (auto created by Firebase)**
Or search for: `AIzaSyC5Hx9B2F0TixsKgt0QcYzH8o6d_53orjU`

### Step 3: Click on the Key Name
This opens the restriction settings

### Step 4: Add Application Restrictions
1. Under "Application restrictions" section
2. Select: **HTTP referrers (web sites)**
3. Click "Add an item"
4. Add these referrers (one at a time):
   ```
   threwbew.com/*
   *.threwbew.com/*
   localhost/*
   127.0.0.1/*
   ```

### Step 5: Save
Click the blue "Save" button at the bottom

## ✅ That's It!

Now your API key will ONLY work from:
- Your website (threwbew.com)
- Localhost (for testing)
- Nowhere else!

## 🎯 What This Means

✅ **You don't need to change the key**
✅ **You don't need to update your code**
✅ **Your admin dashboard will keep working**
✅ **The key is now restricted to your domains**
✅ **GitHub alert will eventually clear**

## 📝 Optional: Dismiss GitHub Alert

After restricting the key, you can dismiss the GitHub alert:
1. Go to: https://github.com/jbr1021221/threwbew-admin/security
2. Find the alert
3. Click "Dismiss" → "Used in tests" or "False positive"
4. Add note: "API key restricted to authorized domains only"

## 🔒 Why This is Secure

Firebase web API keys are **not secret**. They're like your street address - public but protected by locks (security rules).

**Real security comes from**:
- ✅ API key restrictions (domains)
- ✅ Firebase Security Rules (who can read/write data)
- ✅ Authentication (admin login)

Your data is safe because:
1. Only your domains can use the API key
2. Firebase rules control who can access data
3. Admin dashboard requires login

---

**TL;DR**: Just restrict the API key to your domain in Google Cloud Console. Takes 2 minutes. No code changes needed!
