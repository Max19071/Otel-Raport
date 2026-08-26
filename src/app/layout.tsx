import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Link from 'next/link';
import { Home, Settings, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gölköy Yaşam Resort - Yorum Takip',
  description: 'Otel yorum takip ve günlük raporlama paneli',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="font-bold text-xl text-blue-600 flex items-center gap-2">
              <FileText className="w-6 h-6" /> Gölköy Yaşam Resort
            </h1>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 font-medium"><Home className="w-4 h-4" /> Panel</Link>
              <Link href="/settings" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 font-medium"><Settings className="w-4 h-4" /> Ayarlar</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 py-8">{children}</main>
      </body>
    </html>
  );
}
