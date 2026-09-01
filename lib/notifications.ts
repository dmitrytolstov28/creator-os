export type NotificationCategory =
  | "instagram"
  | "ai"
  | "security"
  | "system";

export type CreatorNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
  dedupeKey?: string;
};

type CreateNotificationInput = {
  category: NotificationCategory;
  title: string;
  message: string;
  href?: string;
  dedupeKey?: string;
};

const NOTIFICATIONS_KEY =
  "creatoros-notifications";

export const NOTIFICATIONS_UPDATED_EVENT =
  "creatoros-notifications-updated";

const MAX_NOTIFICATIONS = 50;

function isBrowser() {
  return typeof window !== "undefined";
}

function dispatchNotificationUpdate() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new Event(
      NOTIFICATIONS_UPDATED_EVENT,
    ),
  );
}

export function getNotifications(): CreatorNotification[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        NOTIFICATIONS_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(
        stored,
      ) as CreatorNotification[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (notification) =>
          notification &&
          typeof notification.id ===
            "string" &&
          typeof notification.category ===
            "string" &&
          typeof notification.title ===
            "string" &&
          typeof notification.message ===
            "string",
      )
      .sort(
        (a, b) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      );
  } catch (error) {
    console.error(
      "Failed to read CreatorOS notifications:",
      error,
    );

    return [];
  }
}

function saveNotifications(
  notifications: CreatorNotification[],
) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify(
        notifications.slice(
          0,
          MAX_NOTIFICATIONS,
        ),
      ),
    );

    dispatchNotificationUpdate();
  } catch (error) {
    console.error(
      "Failed to save CreatorOS notifications:",
      error,
    );
  }
}

export function createNotification(
  input: CreateNotificationInput,
) {
  if (!isBrowser()) {
    return;
  }

  const current =
    getNotifications();

  if (input.dedupeKey) {
    const existingIndex =
      current.findIndex(
        (notification) =>
          notification.dedupeKey ===
          input.dedupeKey,
      );

    if (
      existingIndex !== -1
    ) {
      const existing =
        current[
          existingIndex
        ];

      const unchanged =
        existing.category ===
          input.category &&
        existing.title ===
          input.title &&
        existing.message ===
          input.message &&
        existing.href ===
          input.href;

      if (unchanged) {
        return;
      }

      const updated: CreatorNotification =
        {
          ...existing,

          category:
            input.category,

          title:
            input.title,

          message:
            input.message,

          href:
            input.href,

          createdAt:
            new Date().toISOString(),

          read: false,
        };

      const next = [
        updated,
        ...current.filter(
          (_, index) =>
            index !==
            existingIndex,
        ),
      ];

      saveNotifications(
        next,
      );

      return;
    }
  }

  const notification: CreatorNotification =
    {
      id:
        typeof crypto !==
          "undefined" &&
        typeof crypto.randomUUID ===
          "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,

      category:
        input.category,

      title:
        input.title,

      message:
        input.message,

      href:
        input.href,

      dedupeKey:
        input.dedupeKey,

      createdAt:
        new Date().toISOString(),

      read: false,
    };

  saveNotifications([
    notification,
    ...current,
  ]);
}

export function markNotificationRead(
  id: string,
) {
  const current =
    getNotifications();

  const next =
    current.map(
      (notification) =>
        notification.id ===
        id
          ? {
              ...notification,
              read: true,
            }
          : notification,
    );

  saveNotifications(
    next,
  );
}

export function markAllNotificationsRead() {
  const current =
    getNotifications();

  saveNotifications(
    current.map(
      (notification) => ({
        ...notification,
        read: true,
      }),
    ),
  );
}

export function clearNotifications() {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(
      NOTIFICATIONS_KEY,
    );

    dispatchNotificationUpdate();
  } catch (error) {
    console.error(
      "Failed to clear CreatorOS notifications:",
      error,
    );
  }
}