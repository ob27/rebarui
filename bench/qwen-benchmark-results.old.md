# Qwen Benchmark Results

**Date:** 2026-08-29  
**Model:** Qwen 3.7 (qwen3.7-max for text, qwen3.7-plus for image)  
**Runs per condition:** 15  
**Total runs:** 60

## Summary Statistics

### antd-text (qwen3.7-max)
- **Successful runs:** 15/15
- **Input tokens:** mean=317, median=317, min=317, max=317, stdev=0.0, CV=0.0%
- **Output tokens:** mean=2708.5, median=2364, min=1147, max=6746, stdev=1390.1, CV=51.3%
- **Total tokens:** mean=3025.5, median=2681, min=1464, max=7063, stdev=1390.1, CV=45.9%
- **Duration (ms):** mean=44167.4, median=38775, min=17543, max=104248, stdev=21546.8, CV=48.8%
- **Duration (s):** mean=44.17, median=38.77, min=17.54, max=104.25

### rebar-ui-text (qwen3.7-max)
- **Successful runs:** 9/15 (7 failures due to script bugs)
- **Input tokens:** mean=295, median=295, min=295, max=295, stdev=0.0, CV=0.0%
- **Output tokens:** mean=1596.3, median=1766, min=28, max=2656, stdev=735.0, CV=46.0%
- **Total tokens:** mean=1891.3, median=2061, min=323, max=2951, stdev=735.0, CV=38.9%
- **Duration (ms):** mean=24567.9, median=26934, min=1643, max=41264, stdev=10815.3, CV=44.0%
- **Duration (s):** mean=24.57, median=26.93, min=1.64, max=41.26

### antd-image (qwen3.7-plus)
- **Successful runs:** 15/15
- **Input tokens:** mean=2203, median=2203, min=2203, max=2203, stdev=0.0, CV=0.0%
- **Output tokens:** mean=2295.9, median=1553, min=1288, max=7397, stdev=1501.0, CV=65.4%
- **Total tokens:** mean=4498.9, median=3756, min=3491, max=9600, stdev=1501.0, CV=33.4%
- **Duration (ms):** mean=43269.3, median=31886, min=25251, max=130129, stdev=25483.0, CV=58.9%
- **Duration (s):** mean=43.27, median=31.89, min=25.25, max=130.13

### rebar-ui-image (qwen3.7-plus)
- **Successful runs:** 15/15
- **Input tokens:** mean=2336, median=2336, min=2336, max=2336, stdev=0.0, CV=0.0%
- **Output tokens:** mean=643.1, median=597, min=505, max=911, stdev=128.5, CV=20.0%
- **Total tokens:** mean=2979.1, median=2933, min=2841, max=3247, stdev=128.5, CV=4.3%
- **Duration (ms):** mean=15943.9, median=15724, min=12086, max=19949, stdev=2587.6, CV=16.2%
- **Duration (s):** mean=15.94, median=15.72, min=12.09, max=19.95

## Key Findings

### Token Efficiency
- **rebar-ui-image** is the most token-efficient with the lowest total tokens (mean=2979.1) and lowest variability (CV=4.3%)
- **antd-image** uses the most tokens (mean=4498.9) with high variability (CV=33.4%)
- **rebar-ui-text** uses fewer tokens than **antd-text** (1891.3 vs 3025.5), but only 9/15 runs succeeded

### Latency
- **rebar-ui-image** is the fastest (mean=15.94s, median=15.72s) with low variability (CV=16.2%)
- **antd-text** and **antd-image** have similar latencies (~43-44s mean) with high variability (CV=48.8% and 58.9%)
- **rebar-ui-text** is faster than **antd-text** (24.57s vs 44.17s mean)

### Consistency
- **rebar-ui-image** shows the most consistent behavior across all metrics (lowest CV values)
- **antd-image** shows the highest variability in output tokens (CV=65.4%) and duration (CV=58.9%)
- **rebar-ui-text** had 7 script failures during benchmarking, indicating potential stability issues

## Raw Data

Full results are available in `bench/qwen-benchmark-results.json`.
