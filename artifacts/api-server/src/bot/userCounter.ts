import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "users.json");

function ensureDir(): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function load(): Set<number> {
  try {
    ensureDir();
    if (!fs.existsSync(DATA_PATH)) return new Set();
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const arr: number[] = JSON.parse(raw);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function save(users: Set<number>): void {
  try {
    ensureDir();
    fs.writeFileSync(DATA_PATH, JSON.stringify([...users]), "utf8");
  } catch {
    // disk xatosi — hisobni xotirada saqlaymiz
  }
}

const users: Set<number> = load();

export function addUser(userId: number): void {
  if (!users.has(userId)) {
    users.add(userId);
    save(users);
  }
}

export function getUserCount(): number {
  return users.size;
}
