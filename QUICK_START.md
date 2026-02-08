# 🚀 Quick Start: Admin Dashboard on New Device

## One-Time Setup on New Device

### 1. Clone Main Website
```bash
cd ~/projects  # or wherever you want
git clone https://github.com/jbr1021221/laravel.git
cd laravel
```

### 2. Clone Admin Dashboard (inside laravel folder)
```bash
git clone https://github.com/jbr1021221/threwbew-admin.git
```

### 3. Open Admin Dashboard
```bash
cd threwbew-admin
# Open admin.html in browser
```

---

## Daily Usage

### Update Main Website
```bash
cd ~/projects/laravel
git pull origin main
# Edit files...
git add .
git commit -m "Your changes"
git push origin main
```

### Update Admin Dashboard
```bash
cd ~/projects/laravel/threwbew-admin
git pull origin main
# Edit admin files...
git add .
git commit -m "Your changes"
git push origin main
```

---

## 📁 Folder Structure After Setup

```
~/projects/laravel/
├── index.html              ← Main website
├── script.js
├── styles.css
└── threwbew-admin/         ← Admin dashboard (separate git repo)
    ├── admin.html
    ├── admin-script.js
    └── admin-styles.css
```

---

## ✅ Key Points

- **Two separate Git repositories** in one folder
- Main site updates **don't affect** admin dashboard
- Admin dashboard updates **don't affect** main site
- Pull each independently on any device
- Admin files **never appear** in main site deployments

---

## 🔗 Next Steps

1. **Create GitHub repo**: https://github.com/new
   - Name: `threwbew-admin`
   - Visibility: **Private**

2. **Push admin dashboard**:
   ```bash
   cd ~/projects/laravel/threwbew-admin
   git branch -M main
   git remote add origin https://github.com/jbr1021221/threwbew-admin.git
   git push -u origin main
   ```

3. **Done!** Now you can clone on other devices.

---

For detailed instructions, see `ADMIN_SETUP_GUIDE.md`
