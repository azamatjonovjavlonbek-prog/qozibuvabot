import fs from "fs";
import path from "path";
import { ADMIN_ID } from "./config";

const DATA_PATH = path.join(process.cwd(), "data", "ai-credits.json");

export const FREE_CREDITS  = 3;
export const PAID_CREDITS  = 5;
export const AI_CREDIT_PRICE = 50_000;

interface CreditRecord {
  userId: number;
  free: number;
  paid: number;
}

interface Store {
  credits: CreditRecord[];
}

function ensureDir(): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function load(): Store {
  try {
    ensureDir();
    if (!fs.existsSync(DATA_PATH)) return { credits: [] };
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as Store;
  } catch {
    return { credits: [] };
  }
}

function persist(store: Store): void {
  try {
    ensureDir();
    fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch { /* disk xatosi — xotirada saqlaymiz */ }
}

const store: Store = load();
const creditMap = new Map<number, CreditRecord>(
  store.credits.map((c) => [c.userId, c])
);

function getOrCreate(userId: number): CreditRecord {
  if (!creditMap.has(userId)) {
    const rec: CreditRecord = { userId, free: FREE_CREDITS, paid: 0 };
    creditMap.set(userId, rec);
    store.credits.push(rec);
    persist(store);
  }
  return creditMap.get(userId)!;
}

function isAdmin(userId: number): boolean {
  return userId === ADMIN_ID;
}

export function getCredits(userId: number): number {
  if (isAdmin(userId)) return Infinity;
  const rec = getOrCreate(userId);
  return rec.free + rec.paid;
}

export function getFreeCredits(userId: number): number {
  if (isAdmin(userId)) return Infinity;
  return getOrCreate(userId).free;
}

export function hasCredits(userId: number): boolean {
  if (isAdmin(userId)) return true;
  return getCredits(userId) > 0;
}

export function useCredit(userId: number): boolean {
  if (isAdmin(userId)) return true;
  const rec = getOrCreate(userId);
  if (rec.free > 0) { rec.free--; persist(store); return true; }
  if (rec.paid > 0) { rec.paid--; persist(store); return true; }
  return false;
}

export function addPaidCredits(userId: number): void {
  const rec = getOrCreate(userId);
  rec.paid += PAID_CREDITS;
  persist(store);
}
