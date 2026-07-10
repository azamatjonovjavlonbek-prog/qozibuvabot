import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "users.json");

interface UserRecord {
  id: number;
  joinedAt: number;
}

interface Store {
  users: UserRecord[];
}

function ensureDir(): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function load(): Store {
  try {
    ensureDir();
    if (!fs.existsSync(DATA_PATH)) return { users: [] };
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const users: UserRecord[] = (parsed as number[]).map((id) => ({ id, joinedAt: 0 }));
      return { users };
    }
    return parsed as Store;
  } catch {
    return { users: [] };
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
const idSet: Set<number> = new Set(store.users.map((u) => u.id));

export function addUser(userId: number): boolean {
  if (idSet.has(userId)) return false;
  const record: UserRecord = { id: userId, joinedAt: Date.now() };
  store.users.push(record);
  idSet.add(userId);
  save(store);
  return true;
}

export function getUserCount(): number {
  return idSet.size;
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function getTodayCount(): number {
  const today = startOfDay(Date.now());
  return store.users.filter((u) => u.joinedAt >= today).length;
}

export function getWeekCount(): number {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return store.users.filter((u) => u.joinedAt >= weekAgo).length;
}

export function getMonthCount(): number {
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return store.users.filter((u) => u.joinedAt >= monthAgo).length;
}

export function getAllUserIds(): number[] {
  return [...idSet];
}
