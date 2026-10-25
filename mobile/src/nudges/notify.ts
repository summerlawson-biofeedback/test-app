import * as Notifications from 'expo-notifications';

import { loadNudges, logNudgeOutcome, logNudgeSent } from '@/nudges/nudge-log';

export const NUDGE_TEXT = "Your body's running a little hot. Want a 60-second reset?";
const CATEGORY = 'stress-nudge';
const OPENS = '/calm';
/** iOS reports a swipe-away with this action when the category asks for it. */
const IOS_DISMISS_ACTION = 'com.apple.UNNotificationDismissActionIdentifier';
/** Still sitting in Notification Center this long after sending counts as ignored. */
const IGNORED_AFTER_MS = 2 * 60 * 60_000;

/** Show nudges as a banner even while the app is open, and ask iOS to report dismissals. */
export function setUpNudges() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  Notifications.setNotificationCategoryAsync(CATEGORY, [], { customDismissAction: true }).catch(() => {});
}

export async function notificationsAllowed() {
  const status = await Notifications.getPermissionsAsync();
  return status.granted || status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function askForNotifications() {
  if (await notificationsAllowed()) return true;
  const status = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
  return status.granted;
}

export async function sendStressNudge() {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      body: NUDGE_TEXT,
      data: { kind: CATEGORY, url: OPENS },
      categoryIdentifier: CATEGORY,
    },
    trigger: null,
  });
  await logNudgeSent(id);
  return id;
}

/**
 * Handles someone acting on a nudge. Returns the screen to open, or null.
 */
export async function handleNudgeResponse(response: Notifications.NotificationResponse) {
  const { identifier, content } = response.notification.request;
  if (content.data?.kind !== CATEGORY) return null;

  if (response.actionIdentifier === IOS_DISMISS_ACTION) {
    await logNudgeOutcome(identifier, 'dismissed');
    return null;
  }
  await logNudgeOutcome(identifier, 'tapped');
  return OPENS;
}

/**
 * Settles nudges nobody tapped: gone from Notification Center means dismissed, still
 * there after a while means ignored. Run when the app opens or comes back.
 */
export async function settlePendingNudges(now = Date.now()) {
  const pending = (await loadNudges()).filter((n) => n.outcome === 'pending');
  if (pending.length === 0) return;

  const presented = new Set(
    (await Notifications.getPresentedNotificationsAsync()).map((n) => n.request.identifier)
  );
  for (const nudge of pending) {
    if (!presented.has(nudge.id)) await logNudgeOutcome(nudge.id, 'dismissed');
    else if (now - new Date(nudge.sentAt).getTime() > IGNORED_AFTER_MS) {
      await logNudgeOutcome(nudge.id, 'ignored');
    }
  }
}
