# PulsePause roadmap

Build queue, in order. Product rules live in `CLAUDE.md`.

## Last session (October 25, 2026)

**Completed:** Calm screen, stress detector + developer screen, stress nudges with settings,
context check-in, morning inner-weather forecast, `CLAUDE.md` product rules, and this roadmap.
All on the `mobile-app` branch (not merged into `main`). 50 tests passing.

**Next:** item 2, the somatic menu (Hum, Orient, Press and Feel, ordered by context and by each
person's ratings), then the three open `CLAUDE.md` safety and privacy items below.

**For you to do before next session:**
- Test on your iPhone in Expo Go: Calm resets, the morning forecast, and a simulated nudge
  (long-press "Today", then Run detector). Check whether the check-in buttons on the
  notification itself save an answer.
- Check the AWS Amplify console: the latest `main` deploy succeeded and the old `Todo` table
  is gone.
- Watch for the Apple Developer approval email. Once approved, request the Family Controls
  entitlement (see "Waiting on Apple").
- Decide: does the Stressor Shield fit the "not a social-feed blocker" positioning?
- Decide for the outcomes log (item 8): on-device only, or synced to AWS? And who reviews
  the voluntary-participation wording?
- News windows (6) and the weekly report (7): reminders when you open a news app, and
  news-timing patterns like "opened news before 8 a.m.", need Screen Time access. Until then,
  they can use scheduled reminders and in-app data only. Decide whether that's enough to
  start with.

- [x] **1. Calm screen**: 60-second breathing and grounding resets with 1–5 activation ratings before and after.
- [ ] **2. Somatic menu**: Hum, Physiological Sigh, Orient, and Press and Feel, ordered by context and what works best for each person. *(Physiological sigh is built; Hum, Orient and Press and Feel are not.)*
- [x] **3. Stress detector with mock data + simulate button**: personal 14-day baseline, still-vs-moving check, cooldown and quiet hours; hidden developer screen to simulate.
- [x] **4. Stress nudge notification**: "Your body's running a little hot. Want a 60-second reset?" Opens Calm; logs tapped, dismissed or ignored; on/off and frequency in Settings.
- [x] **5. Morning inner-weather forecast**: forecast from last night's sleep and resting heart rate, one gentle suggestion, optional daily notification at a chosen time.
- [ ] **6. News windows**: one to three daily times to check the news cycle on purpose, with a gentle reminder of the next window.
- [ ] **7. Weekly weather report**: plain-language personal patterns and bounce-back time, encouraging only, after at least a week of data.
- [ ] **8. Opt-in outcomes log**: anonymized, voluntary beta results (resets, ratings, nudge responses, shield choices) with a summary screen, separate from clinical care.
- [ ] **9. Real Apple Health connection**: replace `MockHealthDataSource` with HealthKit in a development build. *(After developer approval.)*
- [ ] **10. Stressor Shield + context check-in**: opt-in shielding of chosen apps during stress moments, plus "freeze" detection. *(Context check-in is built; the Shield waits for Family Controls approval.)*

## Also required by CLAUDE.md (not yet built)

- [ ] Gently show 988 after several 5/5 activation ratings in a short window.
- [ ] 988 Suicide & Crisis Lifeline reachable from Settings.
- [ ] Export or delete all on-device data from Settings.

## Waiting on Apple

- [ ] **Apple Developer Program membership** (Individual): needed for a development build, real Apple Health data (item 9) and the Stressor Shield (item 10).
- [ ] **Family Controls entitlement** (distribution): request from Apple for the app and each Screen Time extension; needed for the Stressor Shield and freeze detection (item 10).
