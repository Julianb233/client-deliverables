type NotifyInput = {
  title: string;
  body: string;
  linearUrl?: string;
  portalUrl?: string;
  priority?: "low" | "medium" | "high";
};

type NotifyResult = {
  ok: boolean;
  channel: "telegram" | "disabled";
  error?: string;
};

const TELEGRAM_ENDPOINT = "https://api.telegram.org";

export async function notifyInternalPortalRequest(input: NotifyInput): Promise<NotifyResult> {
  const token = process.env.PORTAL_NOTIFY_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.PORTAL_NOTIFY_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, channel: "disabled", error: "Portal notification Telegram env is not configured." };
  }

  const text = [
    priorityPrefix(input.priority),
    input.title,
    "",
    input.body,
    input.linearUrl ? `Linear: ${input.linearUrl}` : null,
    input.portalUrl ? `Portal: ${input.portalUrl}` : null,
  ].filter(Boolean).join("\n");

  try {
    const response = await fetch(`${TELEGRAM_ENDPOINT}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      return { ok: false, channel: "telegram", error: errorText.slice(0, 500) };
    }

    return { ok: true, channel: "telegram" };
  } catch (error) {
    return { ok: false, channel: "telegram", error: error instanceof Error ? error.message : "Unknown notification error." };
  }
}

function priorityPrefix(priority: NotifyInput["priority"]) {
  if (priority === "high") return "[PPP HIGH PRIORITY]";
  if (priority === "low") return "[PPP]";
  return "[PPP REVIEW]";
}
