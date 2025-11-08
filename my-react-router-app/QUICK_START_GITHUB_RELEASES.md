# 🚀 Quick Start: Upload Course Materials to GitHub Releases

## ✅ What I Created For You:

1. **`scripts/upload-to-github-releases.cjs`** - Uploads PDFs to GitHub
2. **`scripts/update-course-urls.cjs`** - Updates courses.jsx with GitHub URLs
3. **`GITHUB_RELEASES_SETUP.md`** - Full documentation

---

## 📋 Next Steps (5 Minutes):

### Step 1: Install GitHub CLI

Open **PowerShell as Administrator** and run:

```powershell
winget install --id GitHub.cli
```

**Or download**: https://cli.github.com/

After installation, **restart this terminal**.

---

### Step 2: Login to GitHub

```bash
gh auth login
```

Follow the prompts:
- Account: **GitHub.com**
- Protocol: **HTTPS**  
- Authenticate: **Login with a web browser**
- Copy the code shown and paste in your browser

---

### Step 3: Test Upload (One Course)

```bash
node scripts/upload-to-github-releases.cjs --test
```

This will:
- ✅ Upload only **MatheGrundlageI** (~150MB)
- ✅ Create a **draft** release (not public yet)
- ✅ Generate URL mappings
- ⏱️ Takes ~5 minutes

---

### Step 4: Check the Release

Visit: https://github.com/sabinAnwar/website-bauen/releases

You'll see: **"Course Materials - Wirtschaftsinformatik" (Draft)**

Click on it and try downloading one PDF to test!

---

### Step 5: Upload All Courses (50GB)

If the test works:

```bash
node scripts/upload-to-github-releases.cjs --all
```

⏱️ This takes 30-60 minutes (uploading 50GB)

---

### Step 6: Update Your Code

After upload completes:

```bash
node scripts/update-course-urls.cjs
```

This automatically replaces all `/uploads/...` URLs with GitHub CDN URLs.

---

### Step 7: Test Locally

```bash
npm run dev
```

- Open http://localhost:5174
- Login and click a course
- Try downloading a PDF
- It should load from GitHub! 🎉

---

### Step 8: Publish & Deploy

```bash
# Make the release public
gh release edit course-materials-v1.0 --draft=false --repo sabinAnwar/website-bauen

# Deploy to production
git add .
git commit -m "feat: migrate 50GB course materials to GitHub Releases CDN"
git push
```

---

## 💰 Cost: **$0 Forever**

- ✅ Unlimited storage
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ No credit card needed

---

## 📊 What You're Uploading:

- **Total Size**: 50GB+
- **Files**: PDFs, MP3 podcasts, course materials
- **Courses**: MatheGrundlageI + all other courses
- **Largest File**: 19MB (way under 2GB limit ✅)

---

## 🆘 Troubleshooting:

### "gh: command not found"
→ Restart your terminal after installing GitHub CLI

### "HTTP 401: Unauthorized"  
→ Run `gh auth login` again

### Need help?
→ Read full docs: `GITHUB_RELEASES_SETUP.md`

---

## 🎯 Summary:

1. Install GitHub CLI
2. `gh auth login`
3. `node scripts/upload-to-github-releases.cjs --test`
4. Check GitHub releases page
5. `node scripts/upload-to-github-releases.cjs --all`
6. `node scripts/update-course-urls.cjs`
7. `npm run dev` to test
8. `git push` to deploy

**Ready? Let's start with Step 1!** 🚀
