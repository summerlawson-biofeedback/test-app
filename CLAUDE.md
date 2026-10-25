# PulsePause

## Product

PulsePause is a "weather app for your nervous system." Core loop: detect a stress moment
from wearable data, then deliver a 60-second calming reset in that moment. Measuring is not
the differentiator; intervening at the right moment is.

Competitive positioning and what we protect in every build decision: `docs/positioning.md`.

## Principles

- Reinforce progress, never score failure. No red "bad day" language.
- Sleep and fuel are the nervous-system foundation.
- Fuel check-in defaults to no numbers; calories are opt-in only. Never show weight-loss
  framing.
- Copy uses a neutral readiness/recovery tone, not burnout/self-care language. The launch
  audience is midlife women, but the brand must work for anyone.
- Wellness claims only: "notice stress and reset." Never "detect anxiety," "diagnose," or
  anything about medication.

## Stack

- Expo (React Native) iPhone app in `mobile/`. Read `mobile/AGENTS.md` before changing it.
- AWS Amplify + DynamoDB backend in `amplify/`; the landing page and waitlist are the Vite
  app in `src/`.
- Developed in GitHub Codespaces.
- Apple Health integration is pending Apple Developer approval, so use mock data behind a
  clean interface until then (see `mobile/src/health/source.ts`).

## Working style

Keep changes small and explain each one in plain language.
