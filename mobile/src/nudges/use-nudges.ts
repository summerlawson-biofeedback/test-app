import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';

import { handleNudgeResponse, setUpNudges, settlePendingNudges } from '@/nudges/notify';

// Give a tap's response time to arrive before untapped nudges are settled.
const SETTLE_DELAY_MS = 3000;

/** App-wide: opens Calm when a nudge is tapped and keeps the nudge log up to date. */
export function useNudges() {
  const handled = useRef(new Set<string>());

  useEffect(() => {
    // Local notifications are phone-only; the web preview runs without them.
    if (Platform.OS === 'web') return;
    setUpNudges();

    const respond = async (response: Notifications.NotificationResponse) => {
      const key = `${response.notification.request.identifier}:${response.actionIdentifier}`;
      if (handled.current.has(key)) return;
      handled.current.add(key);
      const url = await handleNudgeResponse(response);
      if (url) router.push(url as Href);
    };

    // A tap that launched the app from closed.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => response && respond(response))
      .finally(() => Notifications.clearLastNotificationResponseAsync().catch(() => {}));

    const responses = Notifications.addNotificationResponseReceivedListener(respond);

    let timer = setTimeout(() => settlePendingNudges().catch(() => {}), SETTLE_DELAY_MS);
    const appState = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      clearTimeout(timer);
      timer = setTimeout(() => settlePendingNudges().catch(() => {}), SETTLE_DELAY_MS);
    });

    return () => {
      clearTimeout(timer);
      responses.remove();
      appState.remove();
    };
  }, []);
}
