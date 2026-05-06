export type Lang = "latin" | "cyrillic";

export interface UserProfile {
  lang: Lang;
  phone?: string;
}

const profiles = new Map<number, UserProfile>();

export function getProfile(userId: number): UserProfile | undefined {
  return profiles.get(userId);
}

export function setProfile(userId: number, profile: UserProfile): void {
  profiles.set(userId, profile);
}

export function getLang(userId: number): Lang {
  return profiles.get(userId)?.lang ?? "latin";
}

export function isRegistered(userId: number): boolean {
  return profiles.has(userId);
}

export function updatePhone(userId: number, phone: string): void {
  const p = profiles.get(userId);
  if (p) p.phone = phone;
}
