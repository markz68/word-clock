# Word Clock

Version **1.2.0**. A responsive, installable word clock inspired by the flowing word layout in Simon Heys’s clock. Original implementation; no external fonts, libraries, or tracking.

All words remain visible in gray; the current local time lights up. At 12:48:23 the highlighted words read “Twelve forty eight and twenty three seconds.” Noon and midnight both display Twelve. Single-digit minutes use “oh,” exact hours use “o’clock,” and zero seconds uses “precisely.”

## Features

- Three layouts in Settings: **Word Block** (the original default), **Letter Grid**, and **Word Flip**. Layout, colors, and brightness are saved on this device.
- Word Flip uses split-flap word panels for the hour, minute, and optional seconds. Turn **Show seconds** on or off for three or two panels. Panels stack in portrait and sit side by side in landscape, fitting the available space. Only changing values flip; the display catches up immediately after the app resumes. Device reduced-motion preferences disable the animation. At zero minutes the minute panel reads “o’clock”; single-digit minutes use “oh.” Highlight colors apply to the panel text; inactive-word brightness applies to the other two layouts.
- Letter Grid uses a fixed 11 × 10 face. Five-minute phrases light up; zero to four dots underneath add the remaining minutes. For example, at 1:47, “IT IS QUARTER TO TWO” and two dots light up. Dots always add minutes to the phrase, including “to” phrases. Noon and midnight use TWELVE.
- Letter Grid shows minutes only. The seconds setting is disabled in this view; your previous choice is preserved when returning to Word Block or Word Flip. Both layouts share the seconds preference. “Precisely” belongs to Word Block only.
- Automatically fits the available width and height on portrait and landscape phones, tablets, and monitors, with no clock scrolling.
- Top-right gear-only settings, version in the header, optional seconds, five highlight colors, adjustable inactive word brightness.
- Optional fullscreen and screen wake lock where supported. Device power settings can prevent wake lock.
- Offline support after a successful initial online visit. Time comes from the device, without a server.
- Accessible settings, keyboard controls, and a screen-reader time description without announcements every second.

## Hosting

Published at [Word Clock](https://markz68.github.io/word-clock/). Hosting uses GitHub **Settings → Pages → Deploy from a branch → main → / (root)**. Each release’s deployment is verified separately.

## Install and use

Open the hosted clock. In Chrome or Edge on Android or Windows, use **Install app** in the browser menu, or the install button in Settings when available. On iOS/iPadOS, use Safari → Share → Add to Home Screen. Rotate your phone to change layout. The fullscreen button appears only in browsers that support it.

Open the gear to customize the clock. Preferences are stored locally under `word-clock.preferences`, independently on each browser/device. There are no accounts, cloud sync, or personal records to back up. Clearing site data removes preferences and offline files.

Offline mode requires the browser to finish caching the app during an online visit. Browser storage eviction can remove offline availability. Device time and timezone must be correct. Suspended apps catch up to device time on return.

## Updates and troubleshooting

New releases use a versioned service-worker cache and versioned script/style URLs so a new page cannot accidentally load old code. Navigation uses the current worker’s cached page, keeping offline files consistent. When an update is ready, open Settings and choose **Update available · Restart**. Fully closing all clock tabs/windows and reopening the app also allows a waiting version to activate. An initial online reload may be needed to discover an update. Releases must update the header, footer, README, asset query strings, and service-worker version together.

If installation or offline mode fails, open the HTTPS Pages address in a regular browser tab, reconnect, and reload. Private browsing and some embedded browsers restrict these features.

## Development

No build step. Serve this directory over localhost, for example `python3 -m http.server 8000`, then open `http://localhost:8000`. Service workers require HTTPS or localhost.

Run `node tests/grid.test.cjs` to check the face spelling and all 1,440 minutes, including hour rollover and extra-minute dots.

Run `node tests/flip.test.cjs` to check all 172,800 time/seconds combinations and renderer transitions, interrupted flips, reduced motion, and cleanup.
