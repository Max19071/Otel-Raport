'use client';

import { useEffect, useState } from 'react';
import { Play, CheckCircle, XCircle, MinusCircle, Clock } from 'lucide-react';

type Review = { id:number; authorName:string; rating:number; text:string; sentiment:'olumlu'|'olumsuz'|'notre'; time:string };

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [resultMsg, setResultMsg] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try { const res = await fetch('/api/reviews'); setReviews(await res.json()); }
    catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { void fetchReviews(); }, []);

  const runCron = async () => {
    setRunning(true); setResultMsg('');
    try {
      const res = await fetch('/api/cron/daily-report', { method: 'POST' });
      const data = await res.json();
      if (data.success) { setResultMsg(`Başarılı! Yeni yorumlar: ${data.newReviewsCount}. Durum: ${data.message}`); await fetchReviews(); }
      else setResultMsg(data.message || data.error || 'Bir hata oluştu.');
    } catch (e) { setResultMsg('İstek başarısız: ' + (e instanceof Error ? e.message : 'Bilinmeyen hata')); }
    setRunning(false);
  };

  const olumlu = reviews.filter(r => r.sentiment === 'olumlu').length;
  const olumsuz = reviews.filter(r => r.sentiment === 'olumsuz').length;
  const notre = reviews.filter(r => r.sentiment === 'notre').length;

  return <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div><h2 className="text-2xl font-bold tracking-tight">Yorum Takip Paneli</h2><p className="text-slate-500">Otel yorumlarını takip edin ve günlük raporu manuel çalıştırın.</p></div>
      <button onClick={runCron} disabled={running} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"><Play className="w-4 h-4" />{running ? 'Çalışıyor...' : 'Günlük Raporu Çalıştır'}</button>
    </div>
    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm"><b>Demo modu:</b> Şimdilik gerçek Google yorumları yerine test yorumları kullanılır. Google bağlantısını sonraki aşamada ekleyebiliriz.</div>
    {resultMsg && <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm">{resultMsg}</div>}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Stat title="Toplam Yorum" value={reviews.length} />
      <Stat title="Olumlu" value={olumlu} icon={<CheckCircle className="w-5 h-5 text-green-600" />} />
      <Stat title="Olumsuz" value={olumsuz} icon={<XCircle className="w-5 h-5 text-red-600" />} />
      <Stat title="Nötr" value={notre} icon={<MinusCircle className="w-5 h-5 text-slate-400" />} />
    </div>
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50"><h3 className="font-semibold text-slate-700">Son Yorumlar</h3></div>
      {loading ? <div className="p-8 text-center text-slate-500">Yükleniyor...</div> : reviews.length === 0 ? <div className="p-8 text-center text-slate-500">Henüz yorum yok. “Günlük Raporu Çalıştır” düğmesiyle test edebilirsiniz.</div> :
      <ul className="divide-y divide-slate-100">{reviews.map(r => <li key={r.id} className="p-4">
        <div className="flex justify-between items-start mb-1"><span className="font-medium">{r.authorName}</span><span className="text-slate-400 text-sm flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(r.time).toLocaleDateString('tr-TR')}</span></div>
        <div className="mb-2">{Array.from({length:5}).map((_,i)=><span key={i} className={i<r.rating?'text-yellow-400':'text-slate-200'}>★</span>)}</div>
        <p className="text-slate-600 text-sm">{r.text}</p>
      </li>)}</ul>}
    </div>
  </div>;
}

function Stat({title,value,icon}:{title:string;value:number;icon?:React.ReactNode}) {
  return <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><div className="flex items-center gap-2">{icon}<h3 className="text-sm font-medium text-slate-500">{title}</h3></div><p className="text-3xl font-bold mt-2">{value}</p></div>;
}
