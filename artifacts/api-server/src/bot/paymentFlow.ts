import TelegramBot from "node-telegram-bot-api";
import {
  PAYME_PROVIDER_TOKEN,
  CLICK_PROVIDER_TOKEN,
  SHABLON_PRICE,
  CONSULTATION_PRICE,
  AI_CREDIT_PRICE,
  ARIZA_CATEGORIES,
} from "./config";
import type { Lang } from "./userProfile";
import { tCatLabel } from "./i18n";

export type PaymentProvider = "payme" | "click";

// Telegram UZS: tiyin (1 so'm = 100 tiyin)
const TIYIN = 100;

export async function sendTelegramInvoice(
  bot: TelegramBot,
  chatId: number,
  provider: PaymentProvider,
  payload: string,
  lang: Lang,
): Promise<void> {
  const token = provider === "payme" ? PAYME_PROVIDER_TOKEN : CLICK_PROVIDER_TOKEN;

  let title: string;
  let description: string;
  let amount: number;

  if (payload.startsWith("shablon:")) {
    const catId = payload.replace("shablon:", "");
    const cat = ARIZA_CATEGORIES.find((c) => c.id === catId);
    const catLabel = cat ? tCatLabel(lang, cat.label) : catId;
    title = lang === "cyrillic" ? "Ариза шаблони" : "Ariza shabloni";
    description = catLabel;
    amount = SHABLON_PRICE * TIYIN;
  } else if (payload === "consultation") {
    title = lang === "cyrillic" ? "Юридик консультация" : "Yuridik konsultatsiya";
    description = lang === "cyrillic" ? "Ish vaqti: 10:00–20:00" : "Ish vaqti: 10:00–20:00";
    amount = CONSULTATION_PRICE * TIYIN;
  } else {
    title = "Qozibuva AI — 5 ta savol";
    description = lang === "cyrillic"
      ? "5 та ҳуқуқий савол учун кредит"
      : "5 ta huquqiy savol uchun kredit";
    amount = AI_CREDIT_PRICE * TIYIN;
  }

  await (bot as any).sendInvoice(
    chatId,
    title,
    description,
    payload,
    token,
    "UZS",
    [{ label: title, amount }],
    {
      need_name: false,
      need_phone_number: false,
      need_email: false,
      need_shipping_address: false,
      is_flexible: false,
    },
  );
}
