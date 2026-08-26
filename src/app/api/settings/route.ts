import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.settings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const store = await readStore();
  for (const [key,value] of Object.entries(body)) if (typeof value === 'string') store.settings[key]=value;
  await writeStore(store);
  return NextResponse.json({success:true});
}
