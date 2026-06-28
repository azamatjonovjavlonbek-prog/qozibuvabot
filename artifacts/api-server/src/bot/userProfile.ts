export type Lang = "latin" | "cyrillic";

export interface UserProfile {
  lang: Lang;
  phone?: string;
  lastActivity?: number;
}

const profiles = new Map<number, UserProfile>();

const MAX_PROFILE_AGE_MS = 24 * 60 * 60 * 1000;

export function getProfile(userId: number): UserProfile | undefined {
  return profiles.get(userId);
}

export function setProfile(userId: number, profile: UserProfile): void {
  profiles.set(userId, { ...profile, lastActivity: Date.now() });
}

export function getLang(userId: number): Lang {
  return profiles.get(userId)?.lang ?? "latin";
}

export function isRegistered(userId: number): boolean {
  return profiles.has(userId);
}

export function updatePhone(userId: number, phone: string): void {
  const p = profiles.get(userId);
  if (p) {
    p.phone = phone;
    p.lastActivity = Date.now();
  }
}

export function touchProfile(userId: number): void {
  const p = profiles.get(userId);
  if (p) p.lastActivity = Date.now();
}

export function cleanupOldProfiles(): void {
  const now = Date.now();
  let cleaned = 0;
  for (const [userId, profile] of profiles) {
    const age = now - (profile.lastActivity ?? 0);
    if (age > MAX_PROFILE_AGE_MS) {
      profiles.delete(userId);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    import("../lib/logger").then(({ logger }) =>
      logger.info({ cleaned, remaining: profiles.size }, "Eski profillar tozalandi")
    );
  }
}
