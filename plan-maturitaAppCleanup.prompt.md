# Plan: Full Cleanup — Maturita App Polish & Bug Fixes

The app has critical bugs (broken Firebase auth, inaccessible pages on mobile, layout conflicts), missing routes for existing pages, visual inconsistencies, and UX gaps in the new MiniPlayer and PiP features. This plan fixes **everything** — from P0 blockers to P3 polish — organized into 8 implementation phases. Each step has exact file paths, line references, and clear instructions for what to change.

---

## Phase 1: Firebase Auth — Make Login Actually Work

1. **Refactor `src/firebase/firebaseConfig.js` to use Vite env vars.** Replace all 6 `"PASTE_HERE"` values with `import.meta.env.VITE_FIREBASE_API_KEY`, `import.meta.env.VITE_FIREBASE_AUTH_DOMAIN`, `import.meta.env.VITE_FIREBASE_PROJECT_ID`, `import.meta.env.VITE_FIREBASE_STORAGE_BUCKET`, `import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID`, `import.meta.env.VITE_FIREBASE_APP_ID`.

2. **Create `.env.example`** in workspace root with all 6 `VITE_FIREBASE_*` keys set to empty strings, and add a comment: `# Copy to .env and fill with your Firebase project values`.

3. **Add `.env` to `.gitignore`** (create `.gitignore` if it doesn't exist, or append to it).

4. **Add a guard in `src/firebase/firebaseConfig.js`:** Before `initializeApp()`, check if `import.meta.env.VITE_FIREBASE_API_KEY` is defined and non-empty. If not, export `null` for `auth`, `db`, `googleProvider` and `console.warn('Firebase not configured')`.

5. **Update `src/context/AuthContext.jsx`:** Check if `auth` is `null` before calling `onAuthStateChanged` or `signInWithPopup`. If `auth` is null, set `loading = false` and `user = null` immediately. `signInWithGoogle` should show a friendly alert/toast: `"Firebase není nakonfigurován. Kontaktujte správce."`.

6. **Update `src/context/SyncContext.jsx`:** Check if `db` is `null` before any Firestore operations. If null, skip all sync logic and set `syncStatus` to `'offline'`.

7. **Update `src/pages/LoginPage.jsx`:** Show a clear message when Firebase is not configured instead of letting the user click "Sign In" and get a cryptic error. For example, show a yellow warning banner: `"Přihlášení není dostupné — Firebase konfigurace chybí."`.

---

## Phase 2: Fix Mobile Navigation — Make All Pages Reachable

8. **Add Login to BottomNav** in `src/components/layout/BottomNav.jsx`: Add `{ to: '/login', icon: FaUser, label: 'Přihlášení' }` to the `moreNav` array (around line 19-28).

9. **Remove duplicate Autoscroll** from `moreNav` — it's already in the primary 5-tab bar (`primaryNav` has Scroll), so remove it from `moreNav` to avoid confusion.

10. **Add missing pages to `moreNav`**: Add entries for:
    - `{ to: '/scheduler', icon: FaCalendarAlt, label: 'Plánovač' }`
    - `{ to: '/neumelecky', icon: FaFileAlt, label: 'Neumělecký text' }`
    - `{ to: '/progress', icon: FaChartBar, label: 'Progres' }`

11. **Add orphan page routes in `src/App.jsx`**: Add `<Route>` entries for:
    - `/dopamine` → `DopaminePage`
    - `/random-drill` → `RandomDrillPage`
    - `/timeline` → `TimelinePage`
    - Import the three page components at the top of App.jsx.

12. **Add new pages to navigation**: Add to `moreNav` in BottomNav and to the Header desktop nav in `src/components/layout/Header.jsx`:
    - `{ to: '/dopamine', icon: FaGamepad, label: 'Dopamin' }`
    - `{ to: '/random-drill', icon: FaRandom, label: 'Náhodné' }`
    - Also add Chat (`/chat`) and Presentations (`/presentations`) links to `moreNav`.

13. **Add DopaminePage and RandomDrillPage to the study tools grid** on `src/pages/HomePage.jsx` — add cards linking to `/dopamine` (gamified study) and `/random-drill` (random quiz from all data).

---

## Phase 3: Fix Layout & Positioning Conflicts

14. **Fix z-index hierarchy.** Establish a consistent stacking order across all fixed components. In `src/index.css`, define CSS custom properties or use consistent Tailwind values:
    - BottomNav: `z-50` (keep)
    - Header: `z-50` (keep)
    - BottomNav "More" drawer: `z-50` (keep), backdrop `z-40` (keep)
    - MiniPlayer: change from `z-30` to `z-40` in `src/components/podcast/MiniPlayer.jsx`
    - ExperimentalMenu: change from `z-50` to `z-40` in `src/components/experimental/ExperimentalMenu.jsx`
    - PiPLauncher: change from `z-25` to `z-40` in `src/components/pip/PiPLauncher.jsx`

15. **Fix ExperimentalMenu being hidden when MiniPlayer is visible.** In `src/components/experimental/ExperimentalMenu.jsx` (line 22): Remove the `if (playerVisible) return null;` guard entirely. Instead, **adjust positioning** so ExperimentalMenu moves upward when MiniPlayer is visible. When `playerVisible` is true, add extra `bottom` offset (e.g., on mobile: `bottom-[120px]` instead of `bottom-16`; on desktop: `bottom-[60px]`). This way both are accessible simultaneously.

16. **Fix desktop content hidden behind MiniPlayer.** In `src/components/layout/Layout.jsx` (line 52): The main content `<main>` has `pb-24 md:pb-8`. When MiniPlayer is visible, add additional bottom padding. Import `usePodcast` and conditionally set `pb-24 md:pb-20` when the podcast player is visible (the player bar is ~48px high, so ~80px/`pb-20` gives comfortable spacing).

17. **Fix PiPLauncher inconsistent bottom offsets.** In `src/components/pip/PiPLauncher.jsx`: Unify the hidden-state tab from `bottom-[72px]` to `bottom-[80px]` to match the non-hidden state. Also, adjust both states to account for MiniPlayer visibility: import `usePodcast` context, and when player is visible on mobile, add an additional ~48px to the `bottom` offset so the PiP button sits above the MiniPlayer bar.

18. **Add safe-area-inset-bottom to MiniPlayer.** In `src/components/podcast/MiniPlayer.jsx`: On the collapsed button and the player bar, add `pb-safe` or use `env(safe-area-inset-bottom)` via a utility class in `src/index.css` for iPhone home indicator support. Model it after BottomNav's `.safe-area-bottom` class.

19. **Fix Tailwind `grid-cols-15` missing.** In `tailwind.config.js`: Add `gridTemplateColumns: { '15': 'repeat(15, minmax(0, 1fr))' }` to the `extend` section under `theme`. This fixes the IT question grid layout breaking on large screens in `src/components/dashboard/QuestionGrid.jsx`.

---

## Phase 4: MiniPlayer UX Improvements

20. **Improve mobile progress bar.** In `src/components/podcast/MiniPlayer.jsx` (line 208): Replace the thin 3px `<div>` bar (hidden on desktop) with a proper `<input type="range">` styled for mobile — or add a visible drag thumb indicator. At minimum: increase height to 6px, add a visible circular thumb via a pseudo-element or small `<div>` positioned at `${progress}%`, and change cursor to pointer. This gives users a clear affordance that the bar is interactive.

21. **Improve collapsed state visibility.** In `src/components/podcast/MiniPlayer.jsx` (line 62): Replace the tiny 10px chevron-up icon with a more visible collapsed indicator:
    - Make the button larger: at least `w-10 h-8` with `text-sm`
    - Add a music note icon (`FaMusic`) next to the chevron
    - Add a subtle pulsing dot or glow when audio is currently playing (check `isPlaying` from context)
    - Optionally show the current track name as a mini label

22. **Fix click propagation on player bar.** In `src/components/podcast/MiniPlayer.jsx` (line 222): Instead of `onClick` on the entire bar container (which causes mis-taps), make only a specific "expand/collapse" button clickable. Add an explicit toggle button (chevron icon) in the player bar, and remove the `onClick` from the parent container. Keep `onTouchEnd` handlers on individual controls but remove the need for `stopPropagation`.

23. **Add track artwork/visual identity to MiniPlayer.** Add a small icon or colored indicator by track category: a book icon (`FaBook`) for "Knížky" tracks and a network icon (`FaNetworkWired`) for "PSI" tracks, shown in the player bar next to the track name. This gives visual context about what's playing.

---

## Phase 5: LoginPage — Blend Balatro Theme

24. **Tone down the Balatro background.** In `src/pages/LoginPage.jsx`: Reduce the `hue-rotate` animation speed (currently cycles through full rainbow), lower the background saturation/opacity. Overlay a dark tint (`rgba(0,0,0,0.6)`) so the card-game colors are subdued and the terminal-dark feel comes through. Keep the card border and CRT scanlines but make them more subtle (reduce scanline opacity from ~0.03 to ~0.015).

25. **Unify text styling with terminal theme.** In the LoginPage: Use `font-mono` on the sign-in card text. Change the gold/amber colors to `terminal-accent` white or a soft glow. Keep the card shape and layout but replace custom CSS colors with Tailwind terminal theme tokens. The card should feel like a "terminal card" with a slight Balatro flair, not a completely different app.

26. **Add a "Pokračovat bez přihlášení" (Continue without login) button** that navigates back to `/` (Home). This prevents users from feeling trapped on the login page. Use `useNavigate` from react-router-dom.

27. **Improve error message display.** Replace raw Firebase error codes (`auth/api-key-not-valid`) with user-friendly Czech messages. Map known error codes:
    - `auth/api-key-not-valid` → `"Přihlášení není k dispozici."`
    - `auth/popup-closed-by-user` → `"Přihlášení bylo zrušeno."`
    - `auth/network-request-failed` → `"Chyba sítě. Zkontrolujte připojení."`
    - Default → `"Nastala neočekávaná chyba. Zkuste to znovu."`

---

## Phase 6: Theme & Visual Consistency

28. **Fix theme color inconsistencies.** In `tailwind.config.js`: The `terminal-accent` is `#ffffff` (pure white) but several components use hardcoded purple `#8b5cf6` or `rgba(139, 92, 246, ...)`. Decide on ONE accent color. **Recommendation:** Change `terminal-accent` to a subtle violet/purple `#8b5cf6` — this matches the existing scrollbar, fallback values, and gives the app more visual identity than plain white. Update in `tailwind.config.js` under `theme.extend.colors.terminal.accent`.

29. **Fix custom scrollbar color.** In `src/index.css` (line 193): Replace the hardcoded `rgba(139, 92, 246, 0.15)` with `theme('colors.terminal.accent')` with opacity, or use the CSS custom property `var(--color-terminal-accent)` with an alpha. This ensures the scrollbar matches if the accent color changes.

30. **Fix manifest theme color.** In `public/manifest.json`: Change `theme_color` from `"#f59e0b"` (amber) to `"#0a0a0a"` (matching `terminal-bg`) and `background_color` to `"#0a0a0a"`. This ensures the browser chrome matches the app on mobile.

31. **Fix English strings in Czech app.** Search the codebase for English UI strings and translate them:
    - `ExperimentalMenu.jsx`: `"Functions may be unstable"` → `"Funkce mohou být nestabilní"`
    - Any other English strings in buttons, labels, or messages should be translated to Czech (search for common English words like "Sign In", "Loading", "Error", "Save", "Cancel" across all `.jsx` files).

32. **Reduce PiPLauncher visual roughness.** In `src/components/pip/PiPLauncher.jsx`: Replace `[PiP]` bracket notation with a proper icon button using `FaExternalLinkAlt` or `FaTv` icon with a tooltip. Make the hidden-state reveal tab a small rounded tab instead of a bare `▸` character. Increase the close `✕` button from 9px to at least 12px.

33. **Make PiPLauncher `isDesktop` reactive.** Add a `useEffect` with a `resize` event listener to update `isDesktop` when the window is resized or device is rotated. Use `useState` instead of computing once.

---

## Phase 7: QuestionGrid & Dashboard Improvements

34. **Improve QuestionGrid mobile UX.** In `src/components/dashboard/QuestionGrid.jsx`: On mobile viewports, show the question/book number inside each grid square (like CJ books already do). For IT questions, render the `id` number inside the square, and keep the full title in the `title` attribute. This eliminates the need for long-press on mobile just to know which question you're tapping.

35. **Add progress summary to HomePage.** In `src/pages/HomePage.jsx`: Above the QuestionGrid, add a brief stats row showing: `IT: X/47 zvládnuto | ČJ: Y/20 zvládnuto | Série: Z dní`. Pull IT/CJ progress from localStorage and streak from `useStreak` hook. This gives immediate motivation on app open.

36. **Add an "in progress" state to QuestionGrid.** Currently squares are only green (known) or red (unknown). Add a yellow/amber state for questions the user has started but not mastered. This could be derived from whether the user has opened the question at all (tracked in localStorage) versus marking it as "known" via `KnowledgeCheckbox`.

---

## Phase 8: Cleanup & Polish

37. **Remove dead code.** If `DopaminePage`, `RandomDrillPage`, and `TimelinePage` are now routed (from Step 11), verify each page component renders properly by reviewing its imports and data dependencies. If any page imports data that doesn't exist (e.g., missing JSON), add a placeholder or fallback UI.

38. **Audit Frutiger Aero CSS.** In `src/index.css`: The ~670 lines of Aero overrides use fragile selectors like `.frutiger-aero .fixed.bottom-0`. After the z-index and positioning changes in Phase 3, verify that all Aero overrides still target the correct classes. In particular, check if any `bottom-16` or `bottom-0` selectors need updating.

39. **Clean up ExperimentalMenu toggle styling.** In `src/components/experimental/ExperimentalMenu.jsx` (line 62-76): Replace the inline `style` props on the Frutiger Aero toggle switch with Tailwind utility classes for consistency. The raw `width: '40px'`, `height: '22px'`, `borderRadius: '11px'` can all be expressed as Tailwind classes: `w-10 h-[22px] rounded-full`.

40. **Verify service worker caching.** In `public/sw.js`: Consider adding key static assets to the pre-cache list: `/manifest.json`, `/index.html`, and the main CSS/JS bundles (use a dynamic approach or Vite PWA plugin in the future). For now, just ensure the service worker doesn't interfere with Vite's dev server by only registering in production (the current inline script in `index.html` line 16-18 should check `location.hostname !== 'localhost'`).

---

## Verification Checklist

After implementation, verify each phase:

- **Phase 1:** Run the app → open `/login` → confirm either a friendly "not configured" message appears (no `.env`) or sign-in works (with `.env`). Check console for no Firebase crash errors.
- **Phase 2:** On mobile viewport (375px width), tap BottomNav → "More" → verify Login, Scheduler, Neumělecký text, Progress, Dopamine, Random Drill, Chat, Presentations are all listed and navigable. Visit `/dopamine`, `/random-drill`, `/timeline` directly — all should render.
- **Phase 3:** Open any page with MiniPlayer expanded → verify ExperimentalMenu (flask icon) is still visible. On desktop, scroll to bottom of a long page (e.g., `/it/question/1`) → verify content isn't hidden behind MiniPlayer. On iPhone simulator, verify MiniPlayer doesn't overlap the home indicator.
- **Phase 4:** On mobile, verify the MiniPlayer progress bar has a visible thumb. Collapse the player → verify the collapsed indicator is clearly visible. Tap individual controls without accidentally toggling the track list.
- **Phase 5:** Visit `/login` → verify the page feels like part of the terminal app (dark, monospace) with subtle Balatro flair. Verify "Continue without login" button works. Trigger the sign-in error → verify a Czech-language error message appears.
- **Phase 6:** Inspect the accent color across the app → it should be consistent (either all white or all purple, per the decision). Check scrollbar thumb color matches. Check manifest theme in Chrome DevTools → Application tab.
- **Phase 7:** On mobile, verify IT grid squares show numbers. Check HomePage shows progress stats.
- **Phase 8:** Switch to Frutiger Aero mode → navigate through all pages → verify no layout glitches from the positioning changes.

---

## Key Decisions

- **Firebase config:** Moving to Vite `import.meta.env` variables with graceful degradation when not set, rather than hardcoded values.
- **LoginPage:** Keep Balatro card-game theme but subdued — dark overlay, terminal fonts, muted colors. Not a full restyle.
- **Accent color:** Recommend changing from pure white `#ffffff` to purple `#8b5cf6` for visual identity (matches existing hardcoded values).
- **ExperimentalMenu:** Allow simultaneous visibility with MiniPlayer via position adjustment, not hide/show toggle.
- **Orphan pages:** All get routes and navigation links — no dead pages.
