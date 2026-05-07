import fs from "fs";
import path from "path";
import { logger } from "../lib/logger";

export interface TemplateFile {
  fileId: string;
  fileName: string;
}

const STORE_PATH = path.join(process.cwd(), "data", "template-files.json");

let _cache: Record<string, TemplateFile> | null = null;

function load(): Record<string, TemplateFile> {
  if (_cache !== null) return _cache;
  try {
    if (fs.existsSync(STORE_PATH)) {
      _cache = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as Record<string, TemplateFile>;
      return _cache;
    }
  } catch (err) {
    logger.error({ err }, "Template store o'qishda xato");
  }
  _cache = {};
  return _cache;
}

function save(store: Record<string, TemplateFile>): void {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    logger.error({ err }, "Template store saqlashda xato");
  }
}

export function getTemplate(catId: string): TemplateFile | undefined {
  return load()[catId];
}

export function setTemplate(catId: string, entry: TemplateFile): void {
  const store = load();
  store[catId] = entry;
  _cache = store;
  save(store);
  logger.info({ catId, fileName: entry.fileName }, "Template fayl yangilandi");
}

export function listTemplates(): Record<string, TemplateFile> {
  return load();
}
