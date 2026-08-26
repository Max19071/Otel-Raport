import { NextResponse } from 'next/server';
import { readStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const store = await readStore();
  const reviews = [...store.reviews].sort((a,b)=>new Date(b.time).getTime()-new Date(a.time).getTime());
  return NextResponse.json(reviews);
}
