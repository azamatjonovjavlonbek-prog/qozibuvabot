import crypto from "crypto";

export interface TgUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export function validateInitData(initData: string, botToken: string): TgUser | null {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return null;
    params.delete("hash");
    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
    const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
    if (expectedHash !== hash) return null;
    const userStr = params.get("user");
    if (!userStr) return null;
    return JSON.parse(userStr) as TgUser;
  } catch {
    return null;
  }
}

export function resolveUserId(
  initData: string,
  botToken: string,
  isDev: boolean,
): { userId: number | null; user: TgUser | null } {
  if (initData && botToken) {
    const user = validateInitData(initData, botToken);
    if (user) return { userId: user.id, user };
  }
  if (isDev) return { userId: 0, user: null };
  return { userId: null, user: null };
}

export function displayName(user: TgUser | null): string {
  if (!user) return "Noma'lum";
  if (user.username) return `@${user.username}`;
  return [user.first_name, user.last_name].filter(Boolean).join(" ") || "Noma'lum";
}
