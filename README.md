# Threwbew Admin Dashboard

This is the **admin dashboard** for the Threwbew website. It's kept in a separate repository for security and modularity.

## 📁 Repository Structure

This repository contains **only** the admin dashboard files:
- `admin.html` - Admin dashboard interface
- `admin-script.js` - Dashboard JavaScript logic
- `admin-styles.css` - Dashboard styling
- `firebase-config.template.js` - Firebase configuration template (copy to firebase-config.js)
- Documentation files (README, guides)

**Note**: `firebase-config.js` is gitignored for security. You must create it from the template.

## 🚀 Quick Start

### First Time Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/jbr1021221/threwbew-admin.git threwbew-admin
   cd threwbew-admin
   ```

2. **Set up Firebase configuration**:
   ```bash
   # Copy the template
   cp firebase-config.template.js firebase-config.js
   
   # Edit firebase-config.js and add your Firebase credentials
   # (This file is gitignored and won't be committed)
   ```

3. Open `admin.html` in your browser or deploy to a hosting service

4. Login with your admin credentials

### Updating on Another Device
```bash
cd threwbew-admin
git pull origin main

# If firebase-config.js doesn't exist, create it from template
cp firebase-config.template.js firebase-config.js
# Then edit firebase-config.js with your credentials
```

## 🔐 Security

- **Never commit** `firebase-config.js` with real credentials to a public repository
- Keep this repository **private**
- Change default admin password after first login
- See `SECURITY_GUIDE.md` for more details

## 📊 Features

- Real-time visitor analytics
- Device and location tracking
- Monitored IP addresses tracking
- Export data to CSV
- Responsive design

## 🔗 Related Repositories

- **Main Website**: [threwbew.com repository](https://github.com/jbr1021221/laravel)
- **Admin Dashboard**: This repository (separate)

## 📝 Documentation

- `ADMIN_README.md` - Detailed admin dashboard documentation
- `PASSWORD_GUIDE.md` - How to change admin password
- `SECURITY_GUIDE.md` - Security best practices

## 🌐 Deployment

You can deploy this admin dashboard to:
- GitHub Pages (private repo)
- Netlify
- Vercel
- Any static hosting service

**Important**: Make sure to keep the repository private if it contains sensitive configuration!

## 📱 Access from Multiple Devices

This separate repository allows you to:
1. Pull admin dashboard updates on any device
2. Keep admin files separate from your main website
3. Update admin dashboard without affecting the main site
4. Maintain different deployment pipelines

---

**Note**: This admin dashboard uses Firebase for data storage. Make sure your Firebase configuration is properly set up in `firebase-config.js`.
