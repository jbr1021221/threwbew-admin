# ✅ Quick Checklist: Restrict API Key

## 🎯 Goal
Make your Firebase API key only work from your website

## 📝 Steps (Check off as you go)

### Part 1: Open Console
- [ ] 1. Click this link: https://console.cloud.google.com/apis/credentials?project=countdown-timer-70514
- [ ] 2. Sign in with your Google account (if needed)

### Part 2: Find Your Key
- [ ] 3. Look for "Browser key (auto created by Firebase)"
- [ ] 4. Click on the key name (the blue text)

### Part 3: Add Restrictions
- [ ] 5. Find "Application restrictions" section
- [ ] 6. Select the radio button: "HTTP referrers (web sites)"
- [ ] 7. Click "ADD AN ITEM"

### Part 4: Add Domains
- [ ] 8. Type: `threwbew.com/*` → Click "DONE"
- [ ] 9. Click "ADD AN ITEM" again
- [ ] 10. Type: `*.threwbew.com/*` → Click "DONE"
- [ ] 11. Click "ADD AN ITEM" again
- [ ] 12. Type: `localhost/*` → Click "DONE"
- [ ] 13. Click "ADD AN ITEM" again
- [ ] 14. Type: `127.0.0.1/*` → Click "DONE"

### Part 5: Save
- [ ] 15. Scroll to bottom
- [ ] 16. Click the blue "SAVE" button
- [ ] 17. See "API key saved" message

### Part 6: Test (Optional)
- [ ] 18. Open your admin dashboard locally
- [ ] 19. Verify it still works

### Part 7: Dismiss GitHub Alert (Optional)
- [ ] 20. Go to: https://github.com/jbr1021221/threwbew-admin/security
- [ ] 21. Click "Dismiss alert"
- [ ] 22. Select "Won't fix" or "Used in tests"
- [ ] 23. Add note: "API key restricted to authorized domains"

## ✅ Done!

Your API key is now restricted to your domains only!

---

## 🔗 Quick Links

**Google Cloud Console (API Keys)**:
https://console.cloud.google.com/apis/credentials?project=countdown-timer-70514

**GitHub Security Alerts**:
https://github.com/jbr1021221/threwbew-admin/security

**Detailed Instructions**:
See `HOW_TO_RESTRICT_API_KEY.md` in this folder

---

## 💡 What You're Adding

When you add these referrers, you're saying:
- `threwbew.com/*` = Allow from threwbew.com and any page on it
- `*.threwbew.com/*` = Allow from any subdomain (like admin.threwbew.com)
- `localhost/*` = Allow when testing locally
- `127.0.0.1/*` = Allow when testing locally (alternative)

The `/*` means "any page on this domain"

---

## ⏱️ Time Estimate
- First time: 5 minutes
- If you've done it before: 2 minutes

---

**Need help?** Read the full guide in `HOW_TO_RESTRICT_API_KEY.md`
