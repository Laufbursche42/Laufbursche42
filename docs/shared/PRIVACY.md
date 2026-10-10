# Privacy

This tool runs entirely in your browser. It has no backend and no accounts. This text explains exactly what happens with your data and what does not.

## The short version

The tool collects nothing. There are no accounts, no analytics, no telemetry, no tracking, no ads, no cookies and no third-party scripts. Nothing is ever sent to the author.

## What data the tool handles and where it stays

All of the following stays on your device and is never uploaded to this project:

- Live scooter data read over Bluetooth: telemetry, stored settings, and the serial number and the model derived from it.
- Settings you change on the scooter are written only between your browser and the scooter, not to this project.
- The on-screen log. It stays in the open page, is additionally redacted (no keys, tokens, serial numbers or raw device IDs) and is only saved as a `.txt` when you press it.
- Remembered scooters and a few settings (language, theme) are stored only locally in your browser.

## Network connections

The tool makes a network connection in only one case:

- **Loading the page.** Your browser fetches the static files from the host (see below).

Scooter data, telemetry, the serial or changed settings are never sent to this project. For some models the firmware button opens the matching patcher in a new tab; that is a separate page which connects over Bluetooth itself.

## Hosting and access statistics

The page is served as static files by a host (GitHub Pages / Cloudflare Pages). On each request these providers process technically necessary access data (such as IP address, time and browser identifier) to deliver the files. Cloudflare turns this into aggregated, anonymous statistics (such as country, device type and browser) that the author reviews to see how and from where the tool is used. No personal profiles are built and no accounts are required. See the privacy policies of [GitHub](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement) and [Cloudflare](https://www.cloudflare.com/privacypolicy/) for details.

## Bluetooth to your scooter

A local radio link to your scooter over Web Bluetooth. This is not an internet connection; no data leaves your device over the network. Reading the telemetry, changing settings and any other commands travel only between your browser and the scooter.

## No developer backend

Nothing is ever sent to the author. There is no cloud account and no server operated by this project that receives your data.

## Contact

For privacy questions, contact the author (Laufbursche): [laufbursche42.github.io/Laufbursche42](https://laufbursche42.github.io/Laufbursche42/)
