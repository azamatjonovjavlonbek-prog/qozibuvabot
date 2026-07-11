import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "stats.json");

export type EventType =
  | "join"
  | "shablon_order"
  | "shablon_approved"
  | "professional_order"
  | "professional_approved"
  | "consultation_order"
  | "consultation_approved"
  | "ai_question"
  | "ai_credit_purchased"
  | "aliment_calc"
  | "courts_view"
  | "courts_detail"
  | "doc_analysis"
  | "mini_app_shablon_order"
  | "mini_app_consultation_order"
  | "mini_app_ai_order";

interface StatsEvent {
  userId: number;
  timestamp: number;
  type: EventType;
  detail?: string;
}

interface Store {
  events: StatsEvent[];
}

function ensureDir(): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function load(): Store {
  try {
    ensureDir();
    if (!fs.existsSync(DATA_PATH)) return { events: [] };
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { events: parsed as StatsEvent[] };
    }
    return parsed as Store;
  } catch {
    return { events: [] };
  }
}

function save(store: Store): void {
  try {
    ensureDir();
    fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // disk xatosi — hisobni xotirada saqlaymiz
  }
}

const store: Store = load();

export function recordEvent(userId: number, type: EventType, detail?: string): void {
  const event: StatsEvent = {
    userId,
    timestamp: Date.now(),
    type,
    detail,
  };
  store.events.push(event);
  save(store);
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function getStats(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const event of store.events) {
    counts[event.type] = (counts[event.type] ?? 0) + 1;
  }
  return counts;
}

export function getStatsByPeriod(days: number): Record<string, number> {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const counts: Record<string, number> = {};
  for (const event of store.events) {
    if (event.timestamp >= since) {
      counts[event.type] = (counts[event.type] ?? 0) + 1;
    }
  }
  return counts;
}

export function getActiveUsersCount(days: number): number {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const activeUsers = new Set<number>();
  for (const event of store.events) {
    if (event.timestamp >= since) {
      activeUsers.add(event.userId);
    }
  }
  return activeUsers.size;
}

export function getUniqueJoinUsers(): number {
  const uniqueUsers = new Set<number>();
  for (const event of store.events) {
    if (event.type === "join") {
      uniqueUsers.add(event.userId);
    }
  }
  return uniqueUsers.size;
}

export function getTopServicesByUser(): Array<{ userId: number; eventCount: number; lastActivity: number }> {
  const userMap = new Map<number, { count: number; last: number }>();
  for (const event of store.events) {
    const existing = userMap.get(event.userId);
    if (existing) {
      existing.count++;
      if (event.timestamp > existing.last) existing.last = event.timestamp;
    } else {
      userMap.set(event.userId, { count: 1, last: event.timestamp });
    }
  }
  return Array.from(userMap.entries())
    .map(([userId, data]) => ({ userId, eventCount: data.count, lastActivity: data.last }))
    .sort((a, b) => b.eventCount - a.eventCount);
}
