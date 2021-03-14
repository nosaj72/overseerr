export interface UserSettingsGeneralResponse {
  username?: string;
  region?: string;
  originalLanguage?: string;
}

export interface UserSettingsNotificationsResponse {
  // Email notification settings
  enableEmail: boolean;
  pgpKey?: string;

  // Discord notification settings
  enableDiscord: boolean;
  discordId?: string;

  // Telegram notification settings
  enableTelegram: boolean;
  telegramBotUsername?: string;
  telegramChatId?: string;
  telegramSendSilently?: boolean;
}
