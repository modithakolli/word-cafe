# Security policy

Word Café is an offline app. It has no server, no account and no network access, so the main things to protect are the player's saved progress and the code that reads backup codes.

## Reporting a problem
Please email **modithakolli@gmail.com** with the subject "Word Café security". Include the steps to repeat the problem. I will reply within 7 days. Please do not post details in a public issue until it is fixed.

## What is in scope
- Reading a backup code or saved data in a way that crashes the app, changes data it should not, or runs code.
- Anything that makes the app send data off the phone.
- A way around the Content Security Policy in `www/index.html`.

## How the app protects itself
See [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md). Every protection there is checked by `npm test`, `npm run test:ui` or `npm run test:security`, and the checks run on every push (see `.github/workflows/ci.yml`).

## Supported versions
Only the latest release.
