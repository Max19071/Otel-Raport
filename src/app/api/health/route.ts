import { readStore } from '@/lib/store';
export const dynamic='force-dynamic';
export async function GET(){try{await readStore();return Response.json({ok:true,storage:'local-json'});}catch{return Response.json({ok:false},{status:500});}}
