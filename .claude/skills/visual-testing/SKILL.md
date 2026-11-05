---
name: visual-testing
description: Browser verification workflow using the Claude desktop app's built-in browser tools — start the preview, test interactions, viewport matrix, console/network checks, screenshots as evidence, regression routes, and an honest QA report. Use after any visible frontend change, before merge, or to reproduce a UI bug.
---

# Visual testing

Evidence or it didn't happen. A check you could not run is reported as "not run", never as "pass".

## Tool availability
- The built-in browser tools are `mcp__Claude_Browser__*`. They exist only in sessions inside the Claude desktop app.
- If they are not available, run `npm run build`, do static checks, and write "not verified in a browser" in the report. Do not substitute guesses from reading CSS.

## Workflow
1. **Start.** `preview_start` with `{ name: "kui-anasy-web" }` (Vite on port 5173, `.claude/launch.json`). Note the returned `tabId` and `serverId`. If the page needs the API, say whether it was running; without it the client falls back to built-in default pages.
2. **Smoke.** `read_console_messages` (onlyErrors) and `preview_logs` level `error` — record any errors before testing.
3. **Feature checks.** For each acceptance criterion: navigate to the route (hash URLs like `http://localhost:5173/#/ru/<slug>`), act (`computer` click/type, `find` for refs), confirm with `read_page` / `get_page_text`. Prefer text/structure reads over screenshots for assertions.
4. **Viewport matrix.** `resize_window` to 320×800, 375×812, 768×1024, then preset `desktop` (≈1280). At each: horizontal overflow check via `javascript_tool`:
   `document.documentElement.scrollWidth > window.innerWidth`
   plus menu open/close, longest headings, person names unbroken, images not distorted. Screenshot (`computer` screenshot, `scale: 0.5`) where layout matters.
5. **Network.** `read_network_requests` — no failed requests; no external font or CDN requests (fonts must load from local files).
6. **Keyboard.** Tab through key controls; Esc closes overlays; focus visible (screenshot one focused state).
7. **Reduced motion / theme** when the change involves motion or colour: `resize_window` with `colorScheme` for theme; reduced motion via CSS check (`matchMedia` in `javascript_tool`).
8. **Regression routes.** `#` (home), one CMS page, one dedicated page, `#/ru/<slug>`, an unknown slug (404 page), `#admin` (login screen renders — do not log in with real credentials).
9. **Clean up.** `resize_window` preset `desktop`. Leave the server running unless asked to stop.

## What to look for visually
Overlaps and clipping; inconsistent spacing between sibling blocks; text over images without enough contrast; missing Kazakh glyphs (boxes or fallback-font letters inside words); misaligned grid edges; focus ring invisible on dark surfaces; layout shift when images load.

## Report (to `docs/qa/<YYYY-MM-DD>-<slug>.md`)
```
# QA — <slug> — <date>
Environment: built-in browser (desktop app) | not verified in a browser; API running: yes/no
Matrix: 320 ✔ | 375 ✔ | 768 ✖ | 1280 ✔  (✔ pass, ✖ fail, — not run)
Checks: <criterion> — pass/fail/not run — evidence
Console/network: …
Regression: home ✔, standard ✔, dedicated ✔, ru-prefix ✔, 404 ✔, admin screen ✔
Defects: P1 — <route> — <steps> — expected / actual
```

## Quality criteria
- [ ] Every criterion has a result and evidence.
- [ ] Full viewport matrix recorded (including "not run").
- [ ] Console and network checked.
- [ ] Regression routes covered.
- [ ] Viewport reset at the end.
