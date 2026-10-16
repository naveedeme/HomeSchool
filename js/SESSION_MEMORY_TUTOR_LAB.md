Tutor Lab Integration — Session Memory
Saved: 2026-04-11T21:36:18Z (UTC)

Summary:
- Embedded table-tutor/index.html into js/app.js as an iframe modal (pattern matched to typing-tutor).
- Added a separate "Tutor Lab" panel above Practice Lab in the Review UI; Practice Lab is default.
- Fixed JSX syntax errors; rebuilt js/app.bundle.js using esbuild and validated with bundle-parse-ok.
- Investigated and mitigated hover-clipping by disabling upward translateY on hover across affected UI components (css/app.css). Reverted hover scaling per request. Changes committed (commit 3a3e846) and pushed to origin/main.

Files changed:
- js/app.js (embed + UI relocation)
- js/app.bundle.js (rebuilt)
- css/app.css (hover/clipping fixes)

Current behavior / notes:
- Table Tutor opens in modal and behaves similarly to Typing Tutor.
- Tutor Lab panel present above Practice Lab.
- Visual clipping mitigated by disabling translate-based hover lifts; scaling was reverted.
- If clipping persists for a specific component, inspect ancestor elements for overflow:hidden or transform properties.

How to resume:
1. Checkout main at latest commit (3a3e846).
2. Inspect css/app.css and js/app.js if further fixes are needed.
3. To attempt a safer fix for clipping, identify the exact component/page and share the selector chain or a screenshot.

Saved by: Copilot CLI
