#!/bin/bash
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting rebar-ui release pipeline...${NC}\n"

# Get current version
CURRENT_VERSION=$(node -p "require('./packages/core/package.json').version")
echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"

# Parse version components
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Bump minor version
NEW_MINOR=$((MINOR + 1))
NEW_VERSION="${MAJOR}.${NEW_MINOR}.0"
echo -e "${BLUE}New version: ${NEW_VERSION}${NC}\n"

# Step 1: Run lint
echo -e "${YELLOW}Step 1/6: Running lint...${NC}"
pnpm run lint
echo -e "${GREEN}✓ Lint passed${NC}\n"

# Step 2: Run tests
echo -e "${YELLOW}Step 2/6: Running tests...${NC}"
pnpm run test
echo -e "${GREEN}✓ Tests passed${NC}\n"

# Step 3: Bump version in packages/core/package.json and update marketing page
echo -e "${YELLOW}Step 3/6: Bumping version to ${NEW_VERSION}...${NC}"
node -e "
const fs = require('fs');

// Update package.json
const pkg = JSON.parse(fs.readFileSync('./packages/core/package.json', 'utf8'));
pkg.version = '${NEW_VERSION}';
fs.writeFileSync('./packages/core/package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('Updated packages/core/package.json');

// Update homepage version badge
const homepage = fs.readFileSync('./apps/docs/src/app/page.tsx', 'utf8');
const badgePattern = /badge: \"🚧 [^\"]+\"/;
const newBadge = 'badge: \"🚧 ${NEW_VERSION} Open Beta — see [the repo](https://github.com/ob27/rebarui)\"';
const updatedHomepage = homepage.replace(badgePattern, newBadge);
fs.writeFileSync('./apps/docs/src/app/page.tsx', updatedHomepage);
console.log('Updated homepage version badge');
"
echo -e "${GREEN}✓ Version bumped${NC}\n"

# Step 4: Build
echo -e "${YELLOW}Step 4/6: Building...${NC}"
pnpm run build
echo -e "${GREEN}✓ Build complete${NC}\n"

# Step 5: Commit and push
echo -e "${YELLOW}Step 5/6: Committing and pushing...${NC}"
git add -A
git commit -m "v${NEW_VERSION}: bump versions across all packages"
git push origin main
echo -e "${GREEN}✓ Pushed to GitHub${NC}\n"

# Step 6: Deploy to Firebase
echo -e "${YELLOW}Step 6/6: Deploying to Firebase...${NC}"
cd /Users/tom/oestler
firebase deploy --only hosting
cd - > /dev/null
echo -e "${GREEN}✓ Deployed to Firebase${NC}\n"

echo -e "${GREEN}✅ Release complete! Version ${NEW_VERSION} is now live.${NC}"
