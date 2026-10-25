# PulsePause iPhone app

Expo (React Native) app using Expo Router. Screens live in `src/app/`: Today, Calm, Sleep and Fuel tabs.

This folder has its own `package.json` and `node_modules`, separate from the website at the repo root.

## Run on your iPhone

```bash
cd mobile
npm install
npm run tunnel   # expo start --tunnel
```

Install **Expo Go** from the App Store, then scan the QR code in the terminal with the iPhone Camera app.
The tunnel is needed when running from a Codespace, because the phone can't reach it over local Wi-Fi.

## Checks

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

## Notes

- Apple Health (HealthKit) is not available in Expo Go. Adding it will require a development build
  (`npx eas-cli@latest build --profile development --platform ios`) and an Apple Developer account.
- The app does not connect to the shared Amplify backend yet.
