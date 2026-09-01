export type InterfacePreferences = {
  reducedMotion: boolean;
  enhancedContrast: boolean;
  ambientGlow: boolean;
};

export type NotificationPreferences = {
  instagram: boolean;
  ai: boolean;
  security: boolean;
  system: boolean;
};

export const INTERFACE_PREFERENCES_KEY =
  "creatoros-interface-preferences";

export const NOTIFICATION_PREFERENCES_KEY =
  "creatoros-notification-preferences";

export const PREFERENCES_UPDATED_EVENT =
  "creatoros-preferences-updated";

export const DEFAULT_INTERFACE_PREFERENCES: InterfacePreferences =
  {
    reducedMotion: false,
    enhancedContrast: false,
    ambientGlow: true,
  };

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences =
  {
    instagram: true,
    ai: true,
    security: true,
    system: true,
  };

function isBrowser() {
  return typeof window !== "undefined";
}

export function getInterfacePreferences(): InterfacePreferences {
  if (!isBrowser()) {
    return {
      ...DEFAULT_INTERFACE_PREFERENCES,
    };
  }

  try {
    const stored =
      window.localStorage.getItem(
        INTERFACE_PREFERENCES_KEY,
      );

    if (!stored) {
      return {
        ...DEFAULT_INTERFACE_PREFERENCES,
      };
    }

    const parsed =
      JSON.parse(stored) as Partial<InterfacePreferences>;

    return {
      reducedMotion:
        parsed.reducedMotion === true,

      enhancedContrast:
        parsed.enhancedContrast === true,

      ambientGlow:
        parsed.ambientGlow !== false,
    };
  } catch (error) {
    console.error(
      "Failed to read CreatorOS interface preferences:",
      error,
    );

    return {
      ...DEFAULT_INTERFACE_PREFERENCES,
    };
  }
}

export function saveInterfacePreferences(
  preferences: InterfacePreferences,
) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      INTERFACE_PREFERENCES_KEY,
      JSON.stringify(preferences),
    );

    dispatchPreferencesUpdated();
  } catch (error) {
    console.error(
      "Failed to save CreatorOS interface preferences:",
      error,
    );
  }
}

export function resetInterfacePreferences(): InterfacePreferences {
  const defaults = {
    ...DEFAULT_INTERFACE_PREFERENCES,
  };

  if (!isBrowser()) {
    return defaults;
  }

  try {
    window.localStorage.removeItem(
      INTERFACE_PREFERENCES_KEY,
    );

    dispatchPreferencesUpdated();
  } catch (error) {
    console.error(
      "Failed to reset CreatorOS interface preferences:",
      error,
    );
  }

  return defaults;
}

export function getNotificationPreferences(): NotificationPreferences {
  if (!isBrowser()) {
    return {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
    };
  }

  try {
    const stored =
      window.localStorage.getItem(
        NOTIFICATION_PREFERENCES_KEY,
      );

    if (!stored) {
      return {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
      };
    }

    const parsed =
      JSON.parse(stored) as Partial<NotificationPreferences>;

    return {
      instagram:
        parsed.instagram !== false,

      ai:
        parsed.ai !== false,

      security:
        parsed.security !== false,

      system:
        parsed.system !== false,
    };
  } catch (error) {
    console.error(
      "Failed to read CreatorOS notification preferences:",
      error,
    );

    return {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
    };
  }
}

export function saveNotificationPreferences(
  preferences: NotificationPreferences,
) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      NOTIFICATION_PREFERENCES_KEY,
      JSON.stringify(preferences),
    );

    dispatchPreferencesUpdated();
  } catch (error) {
    console.error(
      "Failed to save CreatorOS notification preferences:",
      error,
    );
  }
}

export function resetNotificationPreferences(): NotificationPreferences {
  const defaults = {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
  };

  if (!isBrowser()) {
    return defaults;
  }

  try {
    window.localStorage.removeItem(
      NOTIFICATION_PREFERENCES_KEY,
    );

    dispatchPreferencesUpdated();
  } catch (error) {
    console.error(
      "Failed to reset CreatorOS notification preferences:",
      error,
    );
  }

  return defaults;
}

export function dispatchPreferencesUpdated() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new Event(
      PREFERENCES_UPDATED_EVENT,
    ),
  );
}