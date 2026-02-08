# 🔐 Step-by-Step: Restrict API Key to Your Domain

## 📋 What You'll Do:
Restrict your Firebase API key so it ONLY works from your website (threwbew.com) and localhost.

**Time needed**: 2 minutes  
**Difficulty**: Easy (just clicking and typing)

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Google Cloud Console

**Click this link** (it opens directly to your project's API credentials):

👉 **https://console.cloud.google.com/apis/credentials?project=countdown-timer-70514**

This will open in your browser. You may need to sign in with your Google account.

---

### Step 2: Find Your API Key

On the page, you'll see a list of credentials. Look for:

**"Browser key (auto created by Firebase)"**

OR look for a key that starts with:
**`AIzaSyC5Hx9B2F0TixsKgt0QcYzH8o6d_53orjU`**

It will be in a table that looks like this:

```
Name                                    Type        Created
─────────────────────────────────────────────────────────────
Browser key (auto created by Firebase)  API key     [date]
```

---

### Step 3: Click on the Key Name

Click on **"Browser key (auto created by Firebase)"** (the blue text)

This will open a new page titled: **"Edit API key"**

---

### Step 4: Set Application Restrictions

On the "Edit API key" page, scroll down to find:

**"Application restrictions"** section

You'll see radio buttons:
- ⚪ None
- ⚪ HTTP referrers (web sites)
- ⚪ IP addresses
- ⚪ Android apps
- ⚪ iOS apps

**Select**: ☑️ **HTTP referrers (web sites)**

---

### Step 5: Add Your Domains

After selecting "HTTP referrers", a new section appears:

**"Website restrictions"**

Click the **"ADD AN ITEM"** button

A text box will appear. Add these one by one:

**First referrer** (type this exactly):
```
threwbew.com/*
```
Click "DONE"

Click **"ADD AN ITEM"** again

**Second referrer**:
```
*.threwbew.com/*
```
Click "DONE"

Click **"ADD AN ITEM"** again

**Third referrer** (for testing locally):
```
localhost/*
```
Click "DONE"

Click **"ADD AN ITEM"** again

**Fourth referrer** (for local testing):
```
127.0.0.1/*
```
Click "DONE"

---

### Step 6: Save Changes

Scroll to the bottom of the page

Click the big blue **"SAVE"** button

You'll see a message: "API key saved"

---

## ✅ Done! Your API Key is Now Restricted

Your API key will now ONLY work from:
- ✅ threwbew.com
- ✅ Any subdomain of threwbew.com (like admin.threwbew.com)
- ✅ localhost (for testing)
- ✅ 127.0.0.1 (for testing)

If someone tries to use your API key from a different website, it **won't work**!

---

## 🎯 What This Means

**Before restriction**:
- ⚠️ API key works from any website
- ⚠️ Anyone can use it (but still protected by Firebase rules)

**After restriction**:
- ✅ API key ONLY works from your domains
- ✅ Much more secure
- ✅ GitHub alert can be dismissed

---

## 🔍 How to Verify It Worked

1. Open your admin dashboard: `/home/jubayer/personal/laravel/threwbew-admin/admin.html`
2. It should still work perfectly (because you're on localhost)
3. The restriction is now active!

---

## 📱 Dismiss GitHub Alert (Optional)

After restricting the key, you can dismiss the GitHub security alert:

1. Go to: **https://github.com/jbr1021221/threwbew-admin/security**
2. Find the alert about "Google API Key"
3. Click **"Dismiss alert"** dropdown
4. Select: **"Used in tests"** or **"Won't fix"**
5. Add note: "API key restricted to authorized domains only"
6. Click **"Dismiss alert"**

---

## ❓ Troubleshooting

### "I don't see the Browser key"
- Look for ANY API key in the list
- It might be named differently
- Look for the key that starts with `AIzaSyC...`

### "I can't find the Application restrictions section"
- Make sure you clicked on the key name (not the checkbox)
- Scroll down on the "Edit API key" page
- It's below the "Name" field

### "My admin dashboard stopped working after restricting"
- Make sure you added `localhost/*` to the referrers
- Try `127.0.0.1/*` instead
- Clear your browser cache and try again

### "The SAVE button is grayed out"
- Make sure you clicked "DONE" after adding each referrer
- Try refreshing the page and starting over

---

## 🎉 Summary

You just:
1. ✅ Opened Google Cloud Console
2. ✅ Found your API key
3. ✅ Restricted it to your domains
4. ✅ Saved the changes

**Your API key is now secure!** It only works from your website and localhost.

**Your admin dashboard still works perfectly!** No code changes needed.

---

## 📞 Need Help?

If you get stuck, the key points are:
1. Go to: https://console.cloud.google.com/apis/credentials?project=countdown-timer-70514
2. Click on your API key
3. Select "HTTP referrers (web sites)"
4. Add: `threwbew.com/*` and `localhost/*`
5. Click "SAVE"

That's it! 🎯
