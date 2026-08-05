import React from 'react';
import { 
  FileCheck2, 
  Search, 
  Building2, 
  Award, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface HeaderBannerProps {
  onStartApply: () => void;
  onTrackStatus: () => void;
  totalApproved: number;
  totalQuota: number;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  onStartApply,
  onTrackStatus,
  totalApproved,
  totalQuota,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl my-4">
      {/* Background Decorative Gradient Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sistem Pelayanan Terpadu PKL & Magang Siantar</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Pengajuan Surat Izin PKL <br />
              <span className="text-emerald-400">
                Dinas Kearsipan & Perpustakaan
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Layanan digital resmi untuk pendaftaran, verifikasi berkas, disposisi pimpinan, dan penerbitan 
              <strong className="text-white font-semibold"> Surat Balasan Izin PKL / Magang</strong> ber-QR Code bagi mahasiswa dan siswa sekolah di Kota Pematang Siantar.
            </p>

            {/* Features Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Proses Transparan (2-4 Hari Kerja)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cetak Surat Balasan Resmi Ber-NIP</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rekomendasi Divisi Berbasis AI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Penerbitan Sertifikat Ber-QR Code</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onStartApply}
                className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <FileCheck2 className="w-4 h-4 text-white" />
                <span>Ajukan Surat Izin PKL Baru</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onTrackStatus}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold px-5 py-3.5 rounded-xl border border-slate-700 text-sm transition-all"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Lacak Status Permohonan</span>
              </button>
            </div>
          </div>

          {/* Right Card / Metric Highlights Column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 shadow-md space-y-1">
              <div className="flex items-center justify-between text-emerald-400">
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md">Total</span>
              </div>
              <div className="text-2xl font-black text-white">{totalApproved + 12}</div>
              <p className="text-slate-400 text-xs font-medium">Peserta PKL Terdaftar</p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 shadow-md space-y-1">
              <div className="flex items-center justify-between text-emerald-400">
                <Building2 className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md">Kuota</span>
              </div>
              <div className="text-2xl font-black text-white">{totalQuota} Quota</div>
              <p className="text-slate-400 text-xs font-medium">Tersedia per Periode</p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 shadow-md space-y-1">
              <div className="flex items-center justify-between text-emerald-400">
                <Clock className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md">Estimasi</span>
              </div>
              <div className="text-2xl font-black text-white">2 - 4 Hari</div>
              <p className="text-slate-400 text-xs font-medium">Durasi Disposisi Surat</p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 shadow-md space-y-1">
              <div className="flex items-center justify-between text-emerald-400">
                <Award className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md">Lokasi</span>
              </div>
              <div className="text-sm font-extrabold text-white leading-tight">Jl. Merdeka No. 1</div>
              <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                Pematang Siantar
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
