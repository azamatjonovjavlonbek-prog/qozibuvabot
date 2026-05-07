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
    | "writing_to_admin"
    | "aliment_salary"
    | "aliment_children"
    | "tahlil_waiting_doc";
  selectedServiceId?: string;
  pendingChatId?: number;
  pendingUsername?: string;
  pendingType?: "shablon" | "professional" | "consultation";
  alimentStatus?: "employed" | "unemployed";
  alimentSalary?: number;
  alimentChildren?: "1" | "2" | "3" | "3plus";
}

export interface AdminState {
  step: "idle" | "sending_ariza" | "setting_template";
  targetUserId?: number;
  targetCatId?: string;
}

const userStates = new Map<number, UserState>();
const adminStates = new Map<number, AdminState>();

export function getState(userId: number): UserState {
  return userStates.get(userId) ?? { step: "idle" };
}

export function setState(userId: number, state: UserState): void {
  userStates.set(userId, state);
}

export function resetState(userId: number): void {
  userStates.set(userId, { step: "idle" });
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
