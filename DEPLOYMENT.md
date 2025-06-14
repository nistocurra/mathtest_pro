# MathTest Pro - Deployment Guide

This guide will help you upload your MathTest Pro project to GitHub and deploy it using GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Git installed on your computer
- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Project

First, make sure your project builds successfully:

```bash
npm install
npm run build
```

### 2. Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: MathTest Pro application"
```

### 3. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `mathtest-pro`
4. Don't initialize with README (since you already have files)
5. Click "Create repository"

### 4. Connect Local Repository to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mathtest-pro.git
git branch -M main
git push -u origin main
```

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. The workflow will automatically deploy your app

### 6. Access Your Live Application

Your MathTest Pro will be available at:
`https://YOUR_USERNAME.github.io/mathtest-pro/`

## 🔧 Manual Deployment Script

You can also use the provided deployment script:

```bash
# Make the script executable
chmod +x scripts/deploy.sh

# Run the deployment script
./scripts/deploy.sh
```

## 🛠️ Updating Your Deployment

To update your deployed application:

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

The GitHub Action will automatically rebuild and redeploy your application.

## 📁 Project Structure After Deployment

```
mathtest-pro/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
├── scripts/
│   └── deploy.sh           # Deployment script
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Built application (auto-generated)
├── .gitignore             # Git ignore rules
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
├── README.md              # Project documentation
└── DEPLOYMENT.md          # This file
```

## 🔍 Troubleshooting

### Build Errors
- Check that all dependencies are installed: `npm install`
- Verify Node.js version: `node --version`
- Check for TypeScript errors if using TypeScript

### Deployment Errors
- Ensure repository name matches in vite.config.js
- Check GitHub Pages settings in repository
- Verify GitHub Actions permissions

### 404 Errors on GitHub Pages
- Check that `base` in vite.config.js matches your repository name
- Ensure all routes are properly configured for SPA

## 🌟 Features Included

- ✅ Automated deployment with GitHub Actions
- ✅ Optimized build configuration
- ✅ Source maps for debugging
- ✅ Code splitting for better performance
- ✅ Environment-specific configurations

## 📧 Support

If you encounter any issues:
1. Check the GitHub Actions logs in your repository
2. Verify all file paths and configurations
3. Ensure your repository is public for GitHub Pages

---

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username in all commands and URLs.