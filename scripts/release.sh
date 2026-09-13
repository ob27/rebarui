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

# Step 3: Bump version in all package.json files and update marketing page
echo -e "${YELLOW}Step 3/6: Bumping version to ${NEW_VERSION}...${NC}"
node -e "
const fs = require('fs');

// All packages that need version bumps
const packages = [
  './packages/core/package.json',
  './packages/placement/package.json',
  './packages/devtools/package.json',
  './packages/theme-sketch/package.json',
  './packages/theme-clean/package.json',
  './packages/adapters/antd/package.json',
  './apps/docs/package.json'
];

// Update all package.json files
packages.forEach(pkgPath => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = '${NEW_VERSION}';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('Updated ' + pkgPath);
});

// Update all version display locations (format: "0.XX Open Beta" with zero-padded minor)
const displayVersion = \`${MAJOR}.\${String(NEW_MINOR).padStart(2, '0')}\`;

// 1. Homepage badge
const homepage = fs.readFileSync('./apps/docs/src/app/page.tsx', 'utf8');
const badgePattern = /badge: \"🚧 [^\"]+\"/;
const newBadge = \`badge: \"🚧 \${displayVersion} Open Beta — see [the repo](https://github.com/ob27/rebarui)\"\`;
const updatedHomepage = homepage.replace(badgePattern, newBadge);
fs.writeFileSync('./apps/docs/src/app/page.tsx', updatedHomepage);
console.log('Updated homepage badge to ' + displayVersion + ' Open Beta');

// 2. SiteHeader trailing text
const siteHeader = fs.readFileSync('./apps/docs/src/components/SiteHeader.tsx', 'utf8');
const headerPattern = /text: \"[^\"]+ Open Beta\"/;
const newHeaderText = \`text: \"\${displayVersion} Open Beta\"\`;
const updatedHeader = siteHeader.replace(headerPattern, newHeaderText);
fs.writeFileSync('./apps/docs/src/components/SiteHeader.tsx', updatedHeader);
console.log('Updated SiteHeader to ' + displayVersion + ' Open Beta');

// 3. CONTRIBUTING.md
const contributing = fs.readFileSync('./CONTRIBUTING.md', 'utf8');
const contribPattern = /Open Beta \([^\)]+\)/;
const newContribText = \`Open Beta (\${displayVersion})\`;
const updatedContrib = contributing.replace(contribPattern, newContribText);
fs.writeFileSync('./CONTRIBUTING.md', updatedContrib);
console.log('Updated CONTRIBUTING.md to ' + displayVersion);
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
