export interface UserState {
  step:
    | "idle"
    | "selecting_ariza"
    | "confirming_ariza"
    | "waiting_ariza_payment"
    | "selecting_consultation"
    | "confirming_consultation"
    | "waiting_consultation_payment";
  selectedArizaId?: string;
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
