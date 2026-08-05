import React, { useState, useEffect } from 'react';
import { PKLApplication, DivisionInfo } from '../types';
import { OfficialLetterView } from './OfficialLetterView';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  FileX, 
  Building2, 
  UserCheck, 
  Calendar, 
  FileText, 
  Printer, 
  Sparkles, 
  AlertCircle,
  Copy,
  ArrowRight
} from 'lucide-react';

interface StatusTrackerProps {
  applications: PKLApplication[];
  divisions: DivisionInfo[];
  initialCode?: string;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  applications,
  divisions,
  initialCode = '',
}) => {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [selectedApp, setSelectedApp] = useState<PKLApplication | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setSearchCode(initialCode);
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim().toUpperCase();
    if (!cleanCode) return;
    setHasSearched(true);
    const found = applications.find(
      (a) => a.registrationCode.toUpperCase() === cleanCode || a.id.toUpperCase() === cleanCode
    );
    setSelectedApp(found || null);
  };

  const getStatusBadge = (status: PKLApplication['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Disetujui - Surat Balasan Terbit</span>
          </span>
        );
      case 'VERIFYING':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Proses Verifikasi Berkas & Disposisi</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Menunggu Peninjauan Petugas</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
            <FileX className="w-4 h-4 text-rose-600" />
            <span>Permohonan Belum Diterima</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 my-6">
      
      {/* Search Header Box */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Pelayanan Publik Realtime
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            Lacak Status Permohonan Surat Izin PKL
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Masukkan Kode Registrasi yang Anda dapatkan saat pengisian formulir online (Contoh: <code className="text-amber-300 font-mono">PKL-DISARPUS-2026-8812</code>).
          </p>
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchCode);
          }}
          className="flex flex-col sm:flex-row gap-2 max-w-2xl"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ketik Kode Registrasi (e.g. PKL-DISARPUS-2026-8812)..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Cari Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample Suggestions */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Uji Coba Kode Registrasi:</span>
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                setSearchCode(app.registrationCode);
                handleSearch(app.registrationCode);
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 font-mono text-[11px] transition-colors"
            >
              {app.registrationCode} ({app.status})
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH RESULTS DISPLAY */}
      {hasSearched && !selectedApp && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Kode Registrasi Tidak Ditemukan</h3>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
            Pastikan Anda mengetikkan Kode Registrasi dengan tepat termasuk tanda hubung. Jika baru saja mendaftar, simpan bukti pendaftaran Anda.
          </p>
        </div>
      )}

      {selectedApp && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-8">
          
          {/* Top Status Overview */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                <span>KODE REGISTRASI:</span>
                <strong className="text-slate-900 font-bold text-sm bg-slate-100 px-2 py-0.5 rounded-md">
                  {selectedApp.registrationCode}
                </strong>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedApp.registrationCode);
                    alert('Kode Registrasi disalin!');
                  }}
                  title="Salin Kode"
                  className="p-1 hover:text-blue-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {selectedApp.fullName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {selectedApp.institutionName} • {selectedApp.major} ({selectedApp.educationLevel})
              </p>
            </div>

            <div>{getStatusBadge(selectedApp.status)}</div>
          </div>

          {/* Timeline Process Tracker */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Tahapan Disposisi & Verifikasi Surat:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                {
                  step: 1,
                  title: '1. Pendaftaran Online',
                  desc: selectedApp.submittedAt,
                  completed: true
                },
                {
                  step: 2,
                  title: '2. Verifikasi Berkas',
                  desc: 'Pemeriksaan Surat Pengantar',
                  completed: selectedApp.status !== 'PENDING'
                },
                {
                  step: 3,
                  title: '3. Disposisi Kadis',
                  desc: selectedApp.reviewedBy || 'Proses Disposisi',
                  completed: selectedApp.status === 'APPROVED' || selectedApp.status === 'REJECTED'
                },
                {
                  step: 4,
                  title: '4. Surat Balasan Terbit',
                  desc: selectedApp.officialLetterNumber || 'Selesai',
                  completed: selectedApp.status === 'APPROVED'
                }
              ].map((stepItem) => (
                <div
                  key={stepItem.step}
                  className={`p-3.5 rounded-xl border space-y-1 text-xs ${
                    stepItem.completed
                      ? 'bg-blue-50/80 border-blue-200 text-blue-950 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{stepItem.title}</span>
                    {stepItem.completed && <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{stepItem.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Info Card */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-2">
              Rincian Permohonan PKL
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">NIM / NISN Pemohon:</span>
                <span className="font-bold text-slate-900">{selectedApp.identityNumber}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Bidang Penempatan PKL:</span>
                <span className="font-bold text-blue-900">
                  {divisions.find((d) => d.id === selectedApp.preferredDivisionId)?.name || 'Bidang Disarpus'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Jadwal Maksud PKL:</span>
                <span className="font-bold text-slate-900">
                  {selectedApp.startDate} s.d {selectedApp.endDate} ({selectedApp.durationMonths} Bulan)
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Kategori Pemohon:</span>
                <span className="font-bold text-slate-900">
                  {selectedApp.applicantType} ({selectedApp.members.length + 1} Orang)
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Pembimbing Lapangan (Pamong):</span>
                <span className="font-bold text-emerald-800">
                  {selectedApp.assignedSupervisor || 'Akan Ditentukan Saat Pembekalan'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Catatan Petugas:</span>
                <span className="font-bold text-slate-800">
                  {selectedApp.approvalNotes || selectedApp.rejectionReason || 'Berkas lengkap, menunggu penjadwalan.'}
                </span>
              </div>
            </div>

            {selectedApp.members.length > 0 && (
              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 block font-semibold mb-1">Anggota Kelompok Tambahan:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  {selectedApp.members.map((m) => (
                    <li key={m.id}>
                      <strong>{m.fullName}</strong> — NIM/NISN: {m.identityNumber}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Call for Official Letter */}
          {selectedApp.status === 'APPROVED' ? (
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Surat Izin Balasan PKL Resmi Siap Dilihat</span>
                </div>
                <h4 className="text-base font-extrabold">
                  Surat Balasan Nomor: {selectedApp.officialLetterNumber || '005.1/842/DISARPUS-PS/2026'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Surat ini dilengkapi Kop Resmi Pemko Pematang Siantar & QR Code Keabsahan Digital.
                </p>
              </div>

              <button
                onClick={() => setShowLetterModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 shrink-0 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau & Cetak Surat Balasan</span>
              </button>
            </div>
          ) : selectedApp.status === 'REJECTED' ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl text-xs space-y-1">
              <strong className="font-bold block">Alasan Penolakan Permohonan:</strong>
              <p>{selectedApp.rejectionReason || 'Kuota divisi telah penuh pada periode yang diajukan.'}</p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs space-y-1">
              <strong className="font-bold flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-700" />
                Surat Balasan Sedang Dalam Proses Penerbitan
              </strong>
              <p>
                Petugas verifikator sedang memeriksa berkas pengantar dari instansi Anda. Silakan periksa kembali halaman ini dalam 1-2 hari kerja.
              </p>
            </div>
          )}

        </div>
      )}

      {/* OFFICIAL LETTER PREVIEW MODAL */}
      {showLetterModal && selectedApp && (
        <OfficialLetterView
          application={selectedApp}
          division={divisions.find((d) => d.id === selectedApp.preferredDivisionId)}
          onClose={() => setShowLetterModal(false)}
        />
      )}

    </div>
  );
};
