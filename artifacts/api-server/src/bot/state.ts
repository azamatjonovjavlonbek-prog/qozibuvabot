export interface UserState {
  step:
    | "idle"
    | "selecting_language"
    | "entering_phone"
    | "selecting_shablon"
    | "confirming_shablon"
    | "waiting_shablon_check"
    | "selecting_professional"
    | "confirming_professional"
    | "waiting_professional_check"
    | "selecting_consultation"
    | "confirming_consultation"
    | "waiting_consultation_check"
    | "ai_legal_chat"
    | "ai_legal_pay_check"
    | "aliment_salary"
    | "aliment_children"
    | "tahlil_waiting_doc"
    | "selecting_payment_method"
    | "waiting_telegram_payment"
    | "waiting_ai_check";
  selectedServiceId?: string;
  pendingChatId?: number;
  pendingUsername?: string;
  pendingType?: "shablon" | "professional" | "consultation" | "ai";
  pendingPayload?: string;
  alimentStatus?: "employed" | "unemployed";
  alimentSalary?: number;
  alimentChildren?: "1" | "2" | "3" | "3plus";
  lastActivity?: number;
}

export interface AdminState {
  step: "idle" | "sending_ariza" | "setting_template" | "broadcasting";
  targetUserId?: number;
  targetCatId?: string;
}

const userStates = new Map<number, UserState>();
const adminStates = new Map<number, AdminState>();

const MAX_STATE_AGE_MS = 3 * 60 * 60 * 1000;

export function getState(userId: number): UserState {
  return userStates.get(userId) ?? { step: "idle" };
}

export function setState(userId: number, state: UserState): void {
  userStates.set(userId, { ...state, lastActivity: Date.now() });
}

export function resetState(userId: number): void {
  userStates.set(userId, { step: "idle", lastActivity: Date.now() });
}

export function getAdminState(adminId: number): AdminState {
  return adminStates.get(adminId) ?? { step: "idle" };
}

export function setAdminState(adminId: number, state: AdminState): void {
  adminStates.set(adminId, state);
}

export function resetAdminState(adminId: number): void {
  adminStates.set(adminId, { step: "idle" });
}

export function cleanupOldStates(): void {
  const now = Date.now();
  let cleaned = 0;
  for (const [userId, state] of userStates) {
    const age = now - (state.lastActivity ?? 0);
    if (age > MAX_STATE_AGE_MS && state.step === "idle") {
      userStates.delete(userId);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    import("../lib/logger").then(({ logger }) =>
      logger.info({ cleaned, remaining: userStates.size }, "Eski state'lar tozalandi")
    );
  }
}
