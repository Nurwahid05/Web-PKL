import React, { useState } from 'react';
import { FAQItem } from '../types';
import { 
  HelpCircle, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  ShieldCheck,
  FileText
} from 'lucide-react';

interface FaqSectionProps {
  faqs: FAQItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesQuery =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 my-6">
      
      {/* FAQ Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
          Panduan & Tanya Jawab
        </span>
        <h2 className="text-2xl sm:text-3xl font-black">
          Pertanyaan Umum (FAQ) & Kontak Pelayanan
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Temukan jawaban seputar syarat pengajuan, waktu verifikasi, dan tata tertib Praktik Kerja Lapangan (PKL) di Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: FAQs list */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari kata kunci faq (e.g. durasi, sertifikat)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex gap-1 text-xs">
              {['ALL', 'PERSYARATAN', 'PROSES', 'PELAKSANAAN'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2 rounded-xl font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Office Contact & Map Location Card */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-900" />
              <span>Lokasi Kantor & Layanan</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Alamat Kantor Resmi:</strong>
                  <span>Jalan Merdeka No. 1, Kelurahan Proklamasi, Kecamatan Siantar Barat, Kota Pematang Siantar, Sumatera Utara 21136</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Jam Operasional Pelayanan:</strong>
                  <span>Senin – Jumat: 08.00 – 16.00 WIB (Sabtu/Minggu & Libur Nasional Tutup)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Telepon Kantor:</strong>
                  <span>(0622) 21008 / WhatsApp Sekretariat</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Email Resmi:</strong>
                  <span className="font-mono text-blue-900 font-bold">disarpus@pematangsiantar.go.id</span>
                </div>
              </div>
            </div>

            {/* Visual Simulated Map Display */}
            <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span>Peta Wilayah Merdeka Square Siantar</span>
                <span className="bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-sm text-[10px]">
                  Terbuka untuk Umum
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Gedung Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar berdekatan dengan Lapangan Adam Malik dan Gedung DPRD Siantar.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
