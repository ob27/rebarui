#!/usr/bin/env bash
# Rebuilds the standalone antd demo embedded live on the homepage (the "migrated to Ant Design"
# side of the migration-comparison section) and copies it into apps/docs/public/demos/.
#
# This is a real, separate Vite+antd build — not a screenshot — so both sides of that comparison
# are genuinely live implementations. It's copied as a static build artifact rather than linked
# live, specifically so antd never becomes a dependency of the main docs app bundle (that would
# contradict the whole "headless, low-fi, no design-system weight until you choose it" pitch this
# site makes).
#
# Built from bench/antd-composite-demo, NOT bench/antd-composite directly — a dedicated clone with
# its "New Project" modal's `open` forced to `false` (the original scaffold forces it `open={true}`
# for the /benchmarks static-screenshot convention, which isn't wanted here: both sides of the
# homepage comparison show the base list view, not the modal, for a fair comparison). Keeping this
# as a separate clone means benchmark reruns of bench/antd-composite are never affected by
# demo-specific tweaks. Run this again whenever bench/antd-composite-demo's content changes.
#
# --base is the absolute /demos/antd-composite/ path, not a relative ./ — found the hard way:
# a relative base makes the built asset references depend on the exact final URL the browser
# resolves the iframe's own document to, which varies by host (a clean-URL-redirecting static
# server can normalize /demos/antd-composite/index.html down to /demos/antd-composite with no
# trailing slash, which then resolves ./assets/... one directory too high — a real 404 caught by
# testing against a real static server, not next dev, which doesn't hit this path at all).
set -euo pipefail
cd "$(dirname "$0")/../../../bench/antd-composite-demo"
npx vite build --base=/demos/antd-composite/
rm -rf ../../apps/docs/public/demos/antd-composite
mkdir -p ../../apps/docs/public/demos/antd-composite
cp -r dist/* ../../apps/docs/public/demos/antd-composite/
echo "Rebuilt apps/docs/public/demos/antd-composite/ from bench/antd-composite-demo."
