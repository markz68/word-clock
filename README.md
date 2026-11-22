# Word Clock

Version **1.0.0**. A responsive, installable word clock inspired by the flowing word layout in Simon Heys’s clock. Original implementation; no external fonts, libraries, or tracking.

All words remain visible in gray; the current local time lights up. At 12:48:23 the highlighted words read “Twelve forty eight and twenty three seconds.” Noon and midnight both display Twelve. Single-digit minutes use “oh,” exact hours use “o’clock,” and zero seconds uses “precisely.”

## Features

- Automatically fits the available width and height on portrait and landscape phones, tablets, and monitors, with no clock scrolling.
- Top-right gear-only settings, version in the header, optional seconds, five highlight colors, adjustable inactive word brightness.
- Optional fullscreen and screen wake lock where supported. Device power settings can prevent wake lock.
- Offline support after a successful initial online visit. Time comes from the device, without a server.
- Accessible settings, keyboard controls, and a screen-reader time description without announcements every second.

## Hosting

In GitHub **Settings → Pages**, choose **Deploy from a branch**, **main**, and **/ (root)**, then Save. The intended Pages address is `https://markz68.github.io/word-clock/`; deployment must be checked separately.

## Install and use

Open the hosted clock. In Chrome or Edge on Android or Windows, use **Install app** in the browser menu, or the install button in Settings when available. On iOS/iPadOS, use Safari → Share → Add to Home Screen. Rotate your phone to change layout. The fullscreen button appears only in browsers that support it.

Open the gear to customize the clock. Preferences are stored locally under `word-clock.preferences`, independently on each browser/device. There are no accounts, cloud sync, or personal records to back up. Clearing site data removes preferences and offline files.

Offline mode requires the browser to finish caching the app during an online visit. Browser storage eviction can remove offline availability. Device time and timezone must be correct. Suspended apps catch up to device time on return.

## Updates and troubleshooting

New releases use a versioned service-worker cache. When an update is ready, open Settings and choose **Update available · Restart**. Fully closing and reopening the app also allows a waiting version to activate. An initial online reload may be needed to discover an update. Releases must update the header, footer, README, and service-worker version together.

If installation or offline mode fails, open the HTTPS Pages address in a regular browser tab, reconnect, and reload. Private browsing and some embedded browsers restrict these features.

## Development

No build step. Serve this directory over localhost, for example `python3 -m http.server 8000`, then open `http://localhost:8000`. Service workers require HTTPS or localhost.
