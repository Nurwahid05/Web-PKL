import React from 'react';
import { LogoEmblem } from './LogoEmblem';
import { MapPin, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <LogoEmblem size="md" />
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  PEMERINTAH KOTA PEMATANG SIANTAR
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  Dinas Kearsipan dan Perpustakaan
                </h3>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Sistem Informasi Pelayanan Pengajuan Surat Izin PKL / Magang terpadu untuk mendukung pengelolaan kearsipan digital dan pengembangan minat baca di Kota Pematang Siantar, Sumatera Utara.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/80 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verifikasi Berkas Digital Ber-QR Code Resmi</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Navigasi Utama
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('beranda')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • Beranda & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('pengajuan')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • Formulir Pengajuan PKL
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('lacak')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • Lacak Status Permohonan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('divisi')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • Kuota & Informasi Bidang
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('faq')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • Panduan & FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Kontak Disarpus Siantar
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Jl. Merdeka No. 1, Kota Pematang Siantar, Sumatera Utara 21136</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>(0622) 21008</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>disarpus@pematangsiantar.go.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                <span>pematangsiantar.go.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2 text-[11px]">
          <p>© {new Date().getFullYear()} Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar. Hak Cipta Dilindungi.</p>
          <p>SIPKL Siantar v2.5 • Terintegrasi Pemko Pematang Siantar</p>
        </div>

      </div>
    </footer>
  );
};
