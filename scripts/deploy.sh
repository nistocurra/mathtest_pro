#!/bin/bash
# scripts/deploy.sh

echo "🚀 Starting deployment process..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📦 Project is ready for deployment." echo"" echo"Next steps:" echo"1. Create a new repository on GitHub named 'mathtest-pro'" echo"2. Run: git remote add origin https://github.com/YOUR_USERNAME/mathtest-pro.git" echo"3. Run: git push -u origin main" echo"4. Enable GitHub Pages in repository settings" echo"" echo"🎉 Your MathTest Pro will be available at: https://YOUR_USERNAME.github.io/mathtest-pro/"