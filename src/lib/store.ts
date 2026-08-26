import { promises as fs } from 'fs';
import path from 'path';

export type Review = {
  id: number;
  externalId: string;
  authorName: string;
  rating: number;
  text: string;
  sentiment: 'olumlu' | 'olumsuz' | 'notre';
  time: string;
};

type Store = {
  reviews: Review[];
  settings: Record<string, string>;
  reportLogs: { id: number; status: string; message: string; createdAt: string }[];
};

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'store.json');
const initialStore: Store = { reviews: [], settings: {}, reportLogs: [] };

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(dataFile); }
  catch { await fs.writeFile(dataFile, JSON.stringify(initialStore, null, 2), 'utf8'); }
}

export async function readStore(): Promise<Store> {
  await ensureStore();
  try { return JSON.parse(await fs.readFile(dataFile, 'utf8')) as Store; }
  catch {
    await fs.writeFile(dataFile, JSON.stringify(initialStore, null, 2), 'utf8');
    return structuredClone(initialStore);
  }
}

export async function writeStore(store: Store) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), 'utf8');
}
