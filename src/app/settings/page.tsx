'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({ webhookUrl: '', fallbackEmail: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { void (async () => {
    try { const res = await fetch('/api/settings'); const data = await res.json(); setSettings({ webhookUrl:data.webhookUrl||'', fallbackEmail:data.fallbackEmail||'' }); }
    finally { setLoading(false); }
  })(); }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(settings) });
      setMessage(res.ok ? 'Ayarlar başarıyla kaydedildi.' : 'Ayarlar kaydedilirken bir hata oluştu.');
    } catch { setMessage('Bağlantı hatası.'); }
    setSaving(false);
  };

  return <div className="max-w-2xl mx-auto space-y-6">
    <div><h2 className="text-2xl font-bold">Ayarlar</h2><p className="text-slate-500">Raporların gönderileceği adresleri yapılandırın.</p></div>
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">{loading ? <div>Yükleniyor...</div> :
      <form onSubmit={handleSave} className="space-y-6">
        <div><label className="block text-sm font-medium mb-1">Lokal Adres (Webhook URL)</label><input type="url" value={settings.webhookUrl} onChange={e=>setSettings({...settings,webhookUrl:e.target.value})} placeholder="https://local-server/api/webhook" className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Yedek E-posta Adresi</label><input type="email" value={settings.fallbackEmail} onChange={e=>setSettings({...settings,fallbackEmail:e.target.value})} placeholder="ornek@golkoyyasam.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
        {message && <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{message}</div>}
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" />{saving?'Kaydediliyor...':'Kaydet'}</button>
      </form>}
    </div>
  </div>;
}
