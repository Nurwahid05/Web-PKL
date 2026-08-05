import React, { useState } from 'react';
import { PKLApplication, DivisionInfo, ApplicantType, EducationLevel } from '../types';
import { OfficialLetterView } from './OfficialLetterView';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Edit, 
  Download, 
  UserCheck, 
  Building2, 
  FileText, 
  KeyRound, 
  Lock, 
  Printer, 
  Sparkles,
  Layers,
  BarChart3,
  RefreshCw,
  Plus,
  UserPlus
} from 'lucide-react';

interface AdminPortalProps {
  applications: PKLApplication[];
  divisions: DivisionInfo[];
  onUpdateApplicationStatus: (
    appId: string,
    status: PKLApplication['status'],
    details: {
      officialLetterNumber?: string;
      assignedSupervisor?: string;
      supervisorNip?: string;
      notes?: string;
    }
  ) => void;
  onUpdateDivisionQuota: (divisionId: string, newMax: number) => void;
  onResetData: () => void;
  onAddNewApplication?: (newApp: PKLApplication) => void;
  isAuthenticated?: boolean;
  setIsAuthenticated?: (auth: boolean) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  applications,
  divisions,
  onUpdateApplicationStatus,
  onUpdateDivisionQuota,
  onResetData,
  onAddNewApplication,
  isAuthenticated: propIsAuth,
  setIsAuthenticated: propSetIsAuth,
}) => {
  const [localIsAuth, setLocalIsAuth] = useState(false);
  const isAuthenticated = propIsAuth !== undefined ? propIsAuth : localIsAuth;
  const setIsAuthenticated = propSetIsAuth || setLocalIsAuth;

  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Quick Officer Application Modal state
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickFullName, setQuickFullName] = useState('');
  const [quickNim, setQuickNim] = useState('');
  const [quickInstitution, setQuickInstitution] = useState('');
  const [quickMajor, setQuickMajor] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickEducationLevel, setQuickEducationLevel] = useState<EducationLevel>('S1');
  const [quickDivisionId, setQuickDivisionId] = useState(divisions[0]?.id || 'div-kearsipan');
  const [quickStartDate, setQuickStartDate] = useState('2026-08-01');
  const [quickEndDate, setQuickEndDate] = useState('2026-10-31');
  const [quickInitialStatus, setQuickInitialStatus] = useState<PKLApplication['status']>('PENDING');
  const [quickAddSuccessMsg, setQuickAddSuccessMsg] = useState<string | null>(null);

  // Filter & Search
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Application for Review Modal
  const [selectedAppModal, setSelectedAppModal] = useState<PKLApplication | null>(null);
  const [reviewStatus, setReviewStatus] = useState<PKLApplication['status']>('APPROVED');
  const [letterNumberInput, setLetterNumberInput] = useState('');
  const [supervisorNameInput, setSupervisorNameInput] = useState('');
  const [supervisorNipInput, setSupervisorNipInput] = useState('');
  const [reviewNotesInput, setReviewNotesInput] = useState('');

  // Letter Preview Trigger
  const [previewAppLetter, setPreviewAppLetter] = useState<PKLApplication | null>(null);

  // Tab mode in admin
  const [adminTab, setAdminTab] = useState<'PERMOHONAN' | 'KUOTA' | 'PESERTA'>('PERMOHONAN');

  // Authenticate PIN
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === '1234') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const openReviewModal = (app: PKLApplication) => {
    setSelectedAppModal(app);
    setReviewStatus(app.status === 'PENDING' ? 'APPROVED' : app.status);
    setLetterNumberInput(app.officialLetterNumber || `005.1/${Math.floor(800 + Math.random() * 200)}/DISARPUS-PS/2026`);
    setSupervisorNameInput(app.assignedSupervisor || 'Budi Santoso, S.Kom, M.T');
    setSupervisorNipInput(app.supervisorNip || '19820412 200801 1 009');
    setReviewNotesInput(app.approvalNotes || app.rejectionReason || 'Permohonan disetujui. Berkas persyaratan memenuhi kualifikasi.');
  };

  const handleSaveReview = () => {
    if (!selectedAppModal) return;

    onUpdateApplicationStatus(selectedAppModal.id, reviewStatus, {
      officialLetterNumber: letterNumberInput,
      assignedSupervisor: supervisorNameInput,
      supervisorNip: supervisorNipInput,
      notes: reviewNotesInput,
    });

    setSelectedAppModal(null);
  };

  // Quick Officer Application Handler
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickFullName.trim() || !quickNim.trim() || !quickInstitution.trim()) {
      alert('Nama, NIM/NISN, dan Instansi/Sekolah wajib diisi.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regCode = `PKL-DISARPUS-2026-${randomNum}`;

    const newApp: PKLApplication = {
      id: `app-officer-${Date.now()}`,
      registrationCode: regCode,
      applicantType: 'PERORANGAN',
      fullName: quickFullName.trim(),
      identityNumber: quickNim.trim(),
      email: quickEmail.trim() || `${quickNim.trim()}@siswa.ac.id`,
      phone: quickPhone.trim() || '081234567890',
      institutionName: quickInstitution.trim(),
      educationLevel: quickEducationLevel,
      major: quickMajor.trim() || 'Umum',
      members: [],
      preferredDivisionId: quickDivisionId,
      startDate: quickStartDate,
      endDate: quickEndDate,
      durationMonths: 3,
      purposeSummary: 'Pengajuan langsung oleh Officer Dinas Kearsipan & Perpustakaan Kota Pematang Siantar',
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: 'Surat_Pengantar_Loket.pdf',
          type: 'SURAT_PENGANTAR',
          size: '1.0 MB',
          uploadDate: new Date().toISOString().split('T')[0]
        }
      ],
      status: quickInitialStatus,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reviewedAt: quickInitialStatus === 'APPROVED' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
      reviewedBy: quickInitialStatus === 'APPROVED' ? 'Drs. Agus Sianipar, M.Si (Sekretaris Dinas)' : undefined,
      officialLetterNumber: quickInitialStatus === 'APPROVED' ? `005.1/${Math.floor(800 + Math.random() * 200)}/DISARPUS-PS/2026` : undefined,
      assignedSupervisor: quickInitialStatus === 'APPROVED' ? 'Budi Santoso, S.Kom, M.T' : undefined,
      supervisorNip: quickInitialStatus === 'APPROVED' ? '19820412 200801 1 009' : undefined,
      approvalNotes: quickInitialStatus === 'APPROVED' ? 'Permohonan diinput langsung & disetujui di Loket Pelayanan Officer Disarpus.' : undefined
    };

    if (onAddNewApplication) {
      onAddNewApplication(newApp);
    }

    setQuickAddSuccessMsg(`Permohonan atas nama ${newApp.fullName} (${newApp.registrationCode}) berhasil dibuat dan langsung tampil di daftar admin!`);
    setShowQuickAddModal(false);
    
    // Reset fields
    setQuickFullName('');
    setQuickNim('');
    setQuickInstitution('');
    setQuickMajor('');
    setQuickEmail('');
    setQuickPhone('');
  };

  // Filtered Applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.registrationCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === 'PENDING' || a.status === 'VERIFYING').length;
  const approvedApps = applications.filter((a) => a.status === 'APPROVED').length;
  const rejectedApps = applications.filter((a) => a.status === 'REJECTED').length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6 text-center">
        <div className="w-14 h-14 bg-blue-100 text-blue-900 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Portal Officer & Verifikator Disarpus
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Masukkan PIN Otorisasi Officer
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="PIN Keamanan (e.g. admin123)..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {authError && (
              <p className="text-xs text-rose-600 font-semibold mt-1">
                PIN Salah! Gunakan PIN Demo: <code className="font-bold">admin123</code>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl text-sm shadow-md transition-all"
          >
            Masuk Ke Dashboard Verifikator
          </button>
        </form>

        <div className="pt-3 border-t border-slate-200">
          <button
            onClick={() => {
              setPinInput('admin123');
              setIsAuthenticated(true);
            }}
            className="text-xs text-blue-700 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Klik Untuk Akses Cepat Demo Admin (`admin123`)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-6">
      
      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Akses Terautentikasi - Officer Disarpus Siantar</span>
          </div>
          <h2 className="text-2xl font-black">
            Dashboard Pemrosesan & Disposisi PKL
          </h2>
          <p className="text-slate-300 text-xs mt-0.5">
            Verifikasi kelayakan berkas, tetapkan pembimbing (pamong), dan terbitkan Surat Balasan Resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5"
            title="Reset ke Data Awal"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-bold border border-rose-800"
          >
            Keluar Mode Admin
          </button>
        </div>
      </div>

      {/* Metrics Stat Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Permohonan</span>
          <div className="text-2xl font-black text-slate-900">{totalApps}</div>
          <span className="text-[11px] text-slate-400">Masuk di sistem</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-amber-700 font-bold uppercase">Menunggu Verifikasi</span>
          <div className="text-2xl font-black text-amber-600">{pendingApps}</div>
          <span className="text-[11px] text-amber-800/80 font-medium">Perlu tindakan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-emerald-700 font-bold uppercase">Disetujui & Terbit</span>
          <div className="text-2xl font-black text-emerald-600">{approvedApps}</div>
          <span className="text-[11px] text-emerald-800/80 font-medium">Surat terbit</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-rose-700 font-bold uppercase">Permohonan Ditolak</span>
          <div className="text-2xl font-black text-rose-600">{rejectedApps}</div>
          <span className="text-[11px] text-rose-800/80 font-medium">Sebab kuota/persyaratan</span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setAdminTab('PERMOHONAN')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
            adminTab === 'PERMOHONAN'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Daftar Permohonan ({applications.length})
        </button>

        <button
          onClick={() => setAdminTab('KUOTA')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
            adminTab === 'KUOTA'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Kelola Kuota Divisi ({divisions.length})
        </button>
      </div>

      {/* TAB 1: APPLICATIONS LIST */}
      {adminTab === 'PERMOHONAN' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
          
          {quickAddSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{quickAddSuccessMsg}</span>
              </div>
              <button
                onClick={() => setQuickAddSuccessMsg(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Search & Filter Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative w-full lg:w-72">
              <input
                type="text"
                placeholder="Cari nama, instansi, atau kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['ALL', 'PENDING', 'VERIFYING', 'APPROVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      filterStatus === st
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'ALL' ? 'Semua' : st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setQuickAddSuccessMsg(null);
                  setShowQuickAddModal(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>+ Input Permohonan Baru (Loket Officer)</span>
              </button>
            </div>
          </div>

          {/* Applications Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-extrabold uppercase border-b border-slate-200">
                  <th className="p-3">Kode & Tanggal</th>
                  <th className="p-3">Nama Pemohon & Instansi</th>
                  <th className="p-3">Divisi Pilihan</th>
                  <th className="p-3">Jadwal PKL</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredApplications.map((app) => {
                  const targetDiv = divisions.find((d) => d.id === app.preferredDivisionId);
                  const isNew = app.status === 'PENDING';
                  return (
                    <tr key={app.id} className={`hover:bg-slate-50 transition-colors ${isNew ? 'bg-amber-50/40' : ''}`}>
                      <td className="p-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-900 block">{app.registrationCode}</strong>
                          {isNew && (
                            <span className="bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-xs text-[9px] uppercase animate-pulse">
                              BARU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{app.submittedAt}</span>
                      </td>

                      <td className="p-3">
                        <strong className="text-slate-900 block text-sm">{app.fullName}</strong>
                        <span className="text-slate-600">
                          {app.institutionName} • {app.major}
                        </span>
                        {app.members.length > 0 && (
                          <span className="block text-[10px] text-indigo-700 font-semibold">
                            + {app.members.length} Anggota Kelompok
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-semibold text-slate-800">
                        {targetDiv?.name || 'Bidang Disarpus'}
                      </td>

                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {app.startDate} s.d {app.endDate}
                      </td>

                      <td className="p-3 text-center">
                        <span
                          className={`inline-block font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => openReviewModal(app)}
                          className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-xs"
                        >
                          Proses / Edit
                        </button>

                        {app.status === 'APPROVED' && (
                          <button
                            onClick={() => setPreviewAppLetter(app)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg text-xs"
                            title="Pratinjau Surat"
                          >
                            <Printer className="w-3.5 h-3.5 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: QUOTA MANAGEMENT */}
      {adminTab === 'KUOTA' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">
            Pengaturan Batas Kuota Peserta per Divisi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {divisions.map((div) => (
              <div key={div.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-slate-900">{div.name}</strong>
                  <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md">
                    {div.code}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span>Terisi: {div.quotaFilled} Orang</span>
                  <span>Batas Maksimal Saat Ini: {div.quotaMax} Orang</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateDivisionQuota(div.id, Math.max(1, div.quotaMax - 1))}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-md"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm px-3">{div.quotaMax}</span>
                  <button
                    onClick={() => onUpdateDivisionQuota(div.id, div.quotaMax + 1)}
                    className="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEW & APPROVAL MODAL */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-5 border border-slate-300">
            
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase">
                  Keputusan Disposisi Officer
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedAppModal.fullName} ({selectedAppModal.registrationCode})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Decision Radio Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Status Keputusan
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReviewStatus('APPROVED')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    reviewStatus === 'APPROVED'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui (Terbitkan Surat)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewStatus('REJECTED')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    reviewStatus === 'REJECTED'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak Permohonan</span>
                </button>
              </div>
            </div>

            {reviewStatus === 'APPROVED' ? (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Surat Balasan Resmi Disarpus:
                  </label>
                  <input
                    type="text"
                    value={letterNumberInput}
                    onChange={(e) => setLetterNumberInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Pembimbing Lapangan (Pamong):
                  </label>
                  <input
                    type="text"
                    value={supervisorNameInput}
                    onChange={(e) => setSupervisorNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIP Pembimbing Lapangan:
                  </label>
                  <input
                    type="text"
                    value={supervisorNipInput}
                    onChange={(e) => setSupervisorNipInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Catatan / Instruksi Hadir Hari Pertama:
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNotesInput}
                    onChange={(e) => setReviewNotesInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alasan Penolakan Permohonan:
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan alasan penolakan..."
                  value={reviewNotesInput}
                  onChange={(e) => setReviewNotesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            )}

            {/* Submit Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedAppModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveReview}
                className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Simpan Keputusan Disposisi
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QUICK ADD OFFICER MODAL */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Form Input Permohonan PKL (Mode Officer)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input cepat berkas fisik/langsung dari pendaftar di loket pelayanan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap Pemohon / Ketua <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmad Rizky"
                    value={quickFullName}
                    onChange={(e) => setQuickFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIM / NISN / Identitas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2108102012"
                    value={quickNim}
                    onChange={(e) => setQuickNim(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Instansi / Universitas / Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Universitas Simalungun"
                    value={quickInstitution}
                    onChange={(e) => setQuickInstitution(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jurusan / Program Studi
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ilmu Perpustakaan"
                    value={quickMajor}
                    onChange={(e) => setQuickMajor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Kontak Pemohon
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ahmad@gmail.com"
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 081260001234"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenjang Pendidikan
                  </label>
                  <select
                    value={quickEducationLevel}
                    onChange={(e) => setQuickEducationLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="SMA/SMK">SMK / SMA</option>
                    <option value="D3">Diploma (D3)</option>
                    <option value="S1">Sarjana (S1)</option>
                    <option value="S2">Magister (S2)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Divisi Penempatan Dituju
                  </label>
                  <select
                    value={quickDivisionId}
                    onChange={(e) => setQuickDivisionId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
                  >
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.quotaMax - d.quotaFilled} sisa)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tanggal Mulai PKL
                  </label>
                  <input
                    type="date"
                    value={quickStartDate}
                    onChange={(e) => setQuickStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tanggal Selesai PKL
                  </label>
                  <input
                    type="date"
                    value={quickEndDate}
                    onChange={(e) => setQuickEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <label className="block font-bold text-emerald-950 mb-1">
                  Status Awal Pemrosesan:
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-bold text-slate-800">
                    <input
                      type="radio"
                      name="quickInitialStatus"
                      value="PENDING"
                      checked={quickInitialStatus === 'PENDING'}
                      onChange={() => setQuickInitialStatus('PENDING')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Menunggu Verifikasi (Pending)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-bold text-emerald-800">
                    <input
                      type="radio"
                      name="quickInitialStatus"
                      value="APPROVED"
                      checked={quickInitialStatus === 'APPROVED'}
                      onChange={() => setQuickInitialStatus('APPROVED')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Langsung Setujui (Approved)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Simpan Permohonan Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LETTER PREVIEW MODAL */}
      {previewAppLetter && (
        <OfficialLetterView
          application={previewAppLetter}
          division={divisions.find((d) => d.id === previewAppLetter.preferredDivisionId)}
          onClose={() => setPreviewAppLetter(null)}
        />
      )}

    </div>
  );
};
