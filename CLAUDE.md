# PulsePause

## Product

PulsePause is a "weather app for your nervous system." Core loop: detect a stress moment
from wearable data, then deliver a 60-second calming reset in that moment. Measuring is not
the differentiator; intervening at the right moment is.

Competitive positioning and what we protect in every build decision: `docs/positioning.md`.

## Origin

Built because a psychiatric NP's patients kept describing how news and social media
triggered their fight-flight-freeze response.

## Principles

- Reinforce progress, never score failure. No red "bad day" language.
- PulsePause is body-first: resets use somatic, sensory anchors (hum, sigh, orient, press)
  to give attention somewhere to go besides the stressor.
- Sleep and fuel are the nervous-system foundation.
- Fuel check-in defaults to no numbers; calories are opt-in only. Never show weight-loss
  framing.
- Copy uses a neutral readiness/recovery tone, not burnout/self-care language. The launch
  audience is midlife women, but the brand must work for anyone.
- Wellness claims only: "notice stress and reset." Never "detect anxiety," "diagnose," or
  anything about medication.

## Language

- Nonpartisan always. Refer to "the news cycle" and "the feed," never a political side,
  party, or issue.
- Track recovery, not stress. Celebrate bounce-back time getting shorter.
- Streaks must be forgiving: a missed day never erases progress.
- Never label any activity, including rest, as productive or unproductive. The meaningful
  distinction is intentional vs. autopilot.

## Detection

- Fight/flight: heart rate above baseline while mostly still.
- Freeze: long sessions in chosen apps with little movement, even without a heart-rate
  spike ("Stuck in the scroll?").
- Motion or a "moving" context tag suppresses stress alerts.

## Safety (required)

- This is a wellness tool, not treatment or crisis care.
- If a user rates activation 5/5 several times in a short window, or types anything
  suggesting crisis, gently show the 988 Suicide & Crisis Lifeline (call or text 988) and
  suggest reaching out to someone they trust. Make this resource always reachable from
  Settings.
- Never claim to detect, diagnose, or treat any condition.

## Privacy (required)

- Health and usage data stays on the device by default. Only sync to AWS what a feature
  truly needs, and explain why to the user.
- Never use health data for advertising or sell it (Apple forbids this).
- Every permission request explains in plain language what it's for.
- Users can export or delete all their data from Settings.
- Fuel and eating data gets extra care: no numbers by default, no weight framing, never
  shown in insights unless the user opted into numbers.

## Stack

- Expo (React Native) iPhone app in `mobile/`. Read `mobile/AGENTS.md` before changing it.
- AWS Amplify + DynamoDB backend in `amplify/`; the landing page and waitlist are the Vite
  app in `src/`.
- Developed in GitHub Codespaces.
- Apple Health integration is pending Apple Developer approval, so use mock data behind a
  clean interface until then (`HealthDataSource` in `mobile/src/health/source.ts`,
  `MockHealthDataSource` in `mobile/src/health/mock-source.ts`).

## Where things live (extend these; don't build parallel versions)

All under `mobile/src/`:

- `constants/theme.ts`: palette, forecast skies, type scale. No hard-coded colours elsewhere.
- `stress/`: baseline, detector and every threshold in `config.ts` (tests in `__tests__/`).
- `nudges/`: stress notification, nudge settings, outcome log, context check-in.
- `calm/`: reset strategies (add new ones to `strategies.ts`), activation ratings log.
- `components/crisis-link.tsx` and `app/support.tsx`: the 988 / Crisis Text Line resource.
- `app/dev.tsx`: hidden developer screen (long-press the Today title, dev builds only).
- Everything on-device is stored with AsyncStorage under `pulsepause.*` keys.

## Working style

Keep changes small and explain each one in plain language.
