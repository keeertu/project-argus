# 🚀 Push Project Argus to GitHub

## Step-by-Step Guide

### Step 1: Initialize Git Repository

Open your terminal in the project root directory and run:

```bash
cd "D:\Projects\Project Argus"
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Project Argus - AI-Powered Rental Scam Detection"
```

### Step 4: Connect to GitHub Repository

You already have a repository at: `https://github.com/kesertu/project-argus`

Connect your local repository to GitHub:

```bash
git remote add origin https://github.com/kesertu/project-argus.git
```

### Step 5: Set Main Branch

```bash
git branch -M main
```

### Step 6: Push to GitHub

```bash
git push -u origin main
```

If you get an authentication error, you'll need to:
1. Generate a Personal Access Token (PAT) on GitHub
2. Use it as your password when prompted

### Step 7: Verify on GitHub

Go to: https://github.com/kesertu/project-argus

You should see all your files!

## Alternative: Using GitHub Desktop

If you prefer a GUI:

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Open GitHub Desktop**
3. **File → Add Local Repository**
4. **Select your project folder**: `D:\Projects\Project Argus`
5. **Click "Publish repository"**
6. **Uncheck "Keep this code private" if you want it public**
7. **Click "Publish repository"**

Done! ✅

## Sharing with Friends

Once pushed, share this link with your friends:
```
https://github.com/kesertu/project-argus
```

They can clone it with:
```bash
git clone https://github.com/kesertu/project-argus.git
cd project-argus
```

## Setup Instructions for Friends

Create a `SETUP.md` file they can follow:

### Backend Setup
```bash
cd project-argus-backend
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn main:app --reload
```

### Frontend Setup
```bash
cd project-argus-frontend
npm install
cp .env.example .env
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- API Docs: http://localhost:8080/docs

## Troubleshooting

### Issue: "fatal: not a git repository"
**Solution:** Make sure you're in the project root directory

### Issue: "remote origin already exists"
**Solution:** 
```bash
git remote remove origin
git remote add origin https://github.com/kesertu/project-argus.git
```

### Issue: "failed to push some refs"
**Solution:** Pull first, then push
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Issue: Authentication failed
**Solution:** Use a Personal Access Token (PAT)
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (all)
4. Copy the token
5. Use it as your password when pushing

## Quick Commands Reference

```bash
# Check status
git status

# Add specific files
git add filename.py

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View commit history
git log --oneline
```

## Best Practices

1. **Commit often** - Small, focused commits
2. **Write clear messages** - Describe what changed and why
3. **Pull before push** - Always sync before pushing
4. **Use branches** - For new features or experiments
5. **Review before commit** - Check what you're committing

## .gitignore

The `.gitignore` file is already set up to exclude:
- `node_modules/`
- `.env` files
- `__pycache__/`
- Build artifacts
- IDE files

This keeps your repository clean!

## Next Steps

After pushing to GitHub:

1. ✅ Add a nice README with screenshots
2. ✅ Add topics/tags to your repo (Python, React, AI, FastAPI)
3. ✅ Enable GitHub Pages for documentation
4. ✅ Set up GitHub Actions for CI/CD
5. ✅ Add a LICENSE file (MIT recommended)
6. ✅ Create a CONTRIBUTING.md guide

## Need Help?

- GitHub Docs: https://docs.github.com
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf
- Ask your friends who already use Git!

---

**You're all set! Happy coding! 🎉**
