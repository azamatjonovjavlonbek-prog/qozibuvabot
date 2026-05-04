export interface UserState {
  step:
    | "idle"
    | "selecting_shablon"
    | "confirming_shablon"
    | "waiting_shablon_check"
    | "selecting_professional"
    | "confirming_professional"
    | "waiting_professional_check"
    | "selecting_consultation"
    | "confirming_consultation"
    | "waiting_consultation_check";
  selectedServiceId?: string;
  pendingChatId?: number;
  pendingUsername?: string;
  pendingType?: "shablon" | "professional" | "consultation";
}

const userStates = new Map<number, UserState>();

export function getState(userId: number): UserState {
  return userStates.get(userId) ?? { step: "idle" };
}

export function setState(userId: number, state: UserState): void {
  userStates.set(userId, state);
}

export function resetState(userId: number): void {
  userStates.set(userId, { step: "idle" });
}
