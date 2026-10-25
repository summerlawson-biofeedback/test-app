# PulsePause roadmap

Build queue, in order. Product rules live in `CLAUDE.md`.

## Last session (October 25, 2026)

**Completed:** Calm screen, stress detector + developer screen, stress nudges with settings,
context check-in, morning inner-weather forecast, `CLAUDE.md` product rules, and this roadmap.
All on the `mobile-app` branch (not merged into `main`). 50 tests passing.

**Next:** item 2, fuel rhythm. Then item 3, the somatic menu (Hum, Orient, Press and Feel, ordered
by context and by each person's ratings), then the three open `CLAUDE.md` safety and privacy
items below.

**For you to do before next session:**
- Test on your iPhone in Expo Go: Calm resets, the morning forecast, and a simulated nudge
  (long-press "Today", then Run detector). Check whether the check-in buttons on the
  notification itself save an answer.
- Check the AWS Amplify console: the latest `main` deploy succeeded and the old `Todo` table
  is gone.
- Watch for the Apple Developer approval email. Once approved, request the Family Controls
  entitlement (see "Waiting on Apple").
- Decide: does the Stressor Shield fit the "not a social-feed blocker" positioning?
- Decide for the outcomes log (item 9): on-device only, or synced to AWS? And who reviews
  the voluntary-participation wording?
- News windows (7) and the weekly report (8): reminders when you open a news app, and
  news-timing patterns like "opened news before 8 a.m.", need Screen Time access. Until then,
  they can use scheduled reminders and in-app data only. Decide whether that's enough to
  start with.

## Build queue

- [x] **1. Calm screen**: 60-second breathing and grounding resets with 1–5 activation ratings before and after.
- [ ] **2. Fuel rhythm**: the Fuel tab always shows Breakfast, AM snack, Lunch, PM snack and Dinner, with gentle, no-numbers logging.
  - Both snack slots are always shown and can't be removed; an optional evening snack can be added.
  - Logging stays no-numbers by default (a tap or a few words); calories remain opt-in only.
  - An unlogged slot is a soft, open slot: never red, never "missed," never a warning.
  - Gentle copy, e.g., "Steady fuel helps your nervous system stay steady." No praise for eating less, no weight language, no comparisons.
  - Never show fuel gaps in insights or forecasts in a way that could feel like a grade.
- [ ] **3. Somatic menu**: Hum, Physiological Sigh, Orient, and Press and Feel, ordered by context and what works best for each person. *(Physiological sigh is built; Hum, Orient and Press and Feel are not.)*
- [x] **4. Stress detector with mock data + simulate button**: personal 14-day baseline, still-vs-moving check, cooldown and quiet hours; hidden developer screen to simulate.
- [x] **5. Stress nudge notification**: "Your body's running a little hot. Want a 60-second reset?" Opens Calm; logs tapped, dismissed or ignored; on/off and frequency in Settings.
- [x] **6. Morning inner-weather forecast**: forecast from last night's sleep and resting heart rate, one gentle suggestion, optional daily notification at a chosen time.
- [ ] **7. News windows**: one to three daily times to check the news cycle on purpose, with a gentle reminder of the next window.
- [ ] **8. Weekly weather report**: plain-language personal patterns and bounce-back time, encouraging only, after at least a week of data.
- [ ] **9. Opt-in outcomes log**: anonymized, voluntary beta results (resets, ratings, nudge responses, shield choices) with a summary screen, separate from clinical care.
- [ ] **10. Real Apple Health connection**: replace `MockHealthDataSource` with HealthKit in a development build. *(After developer approval.)*
- [ ] **11. Stressor Shield + context check-in**: opt-in shielding of chosen apps during stress moments, plus "freeze" detection. *(Context check-in is built; the Shield waits for Family Controls approval.)*
- [ ] **12. Medication reminder (v1, free)**: gentle reminders that keep nudging until the dose is logged in the app. Reminder and log only.
  - Add a medication: name, optional dose, schedule (times per day, specific days, or as needed), optional note (e.g., "with food").
  - At dose time: "Gentle reminder: time for your meds 💛". Re-reminds every 10 min for the first 30 min, then every 30 min, until logged in the app. Swiping a notification away never counts as taken.
  - In-app actions: Taken (timestamped), Skip (optional reason: side effects, ran out, doctor said to, other), Snooze 15/30/60 min. Skip stops reminders for that dose.
  - The dose window closes after 4 hours (adjustable); reminders stop and the dose is marked missed, without shame language. Never "You missed..."
  - Time Sensitive notifications (opt-in) so reminders can break through Focus. Never Critical Alerts.
  - Simple history: taken / skipped / missed per day. No streaks, no scores.
  - Optional refill reminder: enter a pill count; a gentle heads-up when about 7 days remain.
  - Always visible: "PulsePause is a reminder tool, not medical advice. Follow your prescriber's instructions." No dosing advice, interaction checks or recommendations anywhere.
  - Privacy: medication names and dose logs stay on the device. No DynamoDB sync unless the person opts into backup, and then only encrypted.
  - Future hooks (stubbed, not built): Apple Health Medications sync; insights linking on-time doses with Weather Report check-ins and sleep; an adherence summary the person can export for their prescriber.
  - **Benchmark:** Medisafe and Apple Health Medications. Match their core features, but never copy their UI, wording or branding:
    - Taken / Skipped / Snooze (above).
    - As-needed (PRN) meds: no scheduled reminders; log when taken, and show when it was last taken. No minimum-gap warnings or "safe to take" hints (that would be dosing advice).
    - Refill reminders (above).
    - Time-zone change: when the phone's time zone changes, ask once whether to keep doses on home time or move them to local time. Never shift them silently.
    - Apple Watch logging: Taken / Skip / Snooze from the Watch. Needs a watchOS app target, so it waits for a development build.
  - **Our differentiators:**
    1. Reminders repeat until the dose is logged in the app, not just one follow-up.
    2. All core features are free. No paywall.
    3. Later: a link between taking doses and Weather Reports and sleep.

## v2 (opt-in)

- [ ] **Support Person**: a trusted contact can be told when a dose is missed, only with the person's explicit consent.
  - Off by default. Consent is asked separately for each medication, and it can be turned off at any time from Settings.
  - The contact also agrees before receiving anything.
  - The message is minimal by default (e.g., "a reminder in PulsePause wasn't logged"). The medication name is included only if the person chooses to share it.
  - This is the first medication feature that has to leave the device (a message has to be sent). Explain why to the person, and send only what's needed.

## Also required by CLAUDE.md (not yet built)

- [ ] Gently show 988 after several 5/5 activation ratings in a short window.
- [ ] 988 Suicide & Crisis Lifeline reachable from Settings.
- [ ] Export or delete all on-device data from Settings.

## Waiting on Apple

- [ ] **Apple Developer Program membership** (Individual): needed for a development build, real Apple Health data (item 10) and the Stressor Shield (item 11).
- [ ] **Time Sensitive Notifications capability**: needed for medication reminders to break through Focus (item 12). Needs a development build, so it isn't available in Expo Go.
- [ ] **Family Controls entitlement** (distribution): request from Apple for the app and each Screen Time extension; needed for the Stressor Shield and freeze detection (item 11).
