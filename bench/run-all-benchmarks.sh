#!/bin/bash
# Run all 60 Qwen benchmark iterations (4 conditions × 15 variants)
#
# Deliberately NOT `set -e`: a single run failing (bad model output, a typecheck failure) must
# not abort the whole batch — each run's success/failure is recorded in the results JSON, and
# the point of n=15 is precisely to survive a few bad runs without losing the rest of the sample.

echo "Starting all Qwen benchmark runs..."
echo ""

CONDITIONS=("antd-text" "rebar-ui-text" "antd-image" "rebar-ui-image")

for condition in "${CONDITIONS[@]}"; do
  echo "=========================================="
  echo "Running condition: $condition"
  echo "=========================================="
  
  for i in {1..15}; do
    echo ""
    echo ">>> Run $i/15 for $condition"
    npx tsx bench/run-qwen-benchmark.ts "$condition" "$i"
    
    # Small delay to avoid rate limiting
    sleep 2
  done
  
  echo ""
  echo "✓ Completed all 15 runs for $condition"
  echo ""
done

echo ""
echo "=========================================="
echo "All 60 benchmark runs complete!"
echo "=========================================="
echo ""
echo "Results saved to: bench/qwen-benchmark-results.json"
