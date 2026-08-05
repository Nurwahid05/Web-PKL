/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeaderBanner } from './components/HeaderBanner';
import { ApplicationForm } from './components/ApplicationForm';
import { StatusTracker } from './components/StatusTracker';
import { DivisionsInfo } from './components/DivisionsInfo';
import { AdminPortal } from './components/AdminPortal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

import { PKLApplication, DivisionInfo } from './types';
import { INITIAL_APPLICATIONS, INITIAL_DIVISIONS, INITIAL_FAQS } from './data/mockData';

import { 
  FileCheck2, 
  Search, 
  Building2, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  BookOpen, 
  Archive, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [trackCode, setTrackCode] = useState<string>('');

  // Persisted admin session state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('disarpus_admin_authenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('disarpus_admin_authenticated', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Persisted state in LocalStorage with fallbacks
  const [applications, setApplications] = useState<PKLApplication[]>(() => {
    const saved = localStorage.getItem('disarpus_pkl_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [divisions, setDivisions] = useState<DivisionInfo[]>(() => {
    const saved = localStorage.getItem('disarpus_pkl_divisions');
    return saved ? JSON.parse(saved) : INITIAL_DIVISIONS;
  });

  useEffect(() => {
    localStorage.setItem('disarpus_pkl_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('disarpus_pkl_divisions', JSON.stringify(divisions));
  }, [divisions]);

  // Handle new submission
  const handleNewApplication = (newApp: PKLApplication) => {
    setApplications((prev) => [newApp, ...prev]);
    
    // Increment division quota filled count
    setDivisions((prevDivs) =>
      prevDivs.map((div) => {
        if (div.id === newApp.preferredDivisionId) {
          return { ...div, quotaFilled: div.quotaFilled + 1 };
        }
        return div;
      })
    );
  };

  const handleOpenAdmin = () => {
    setIsAdminMode(true);
  };

  // Handle Quick Track Search
  const handleQuickTrack = (code: string) => {
    setTrackCode(code);
    setActiveTab('lacak');
    setIsAdminMode(false);
  };

  // Update Application Status (Admin)
  const handleUpdateApplicationStatus = (
    appId: string,
    status: PKLApplication['status'],
    details: {
      officialLetterNumber?: string;
      assignedSupervisor?: string;
      supervisorNip?: string;
      notes?: string;
    }
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status,
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            reviewedBy: 'Drs. Agus Sianipar, M.Si (Sekretaris Dinas)',
            officialLetterNumber: details.officialLetterNumber || app.officialLetterNumber,
            assignedSupervisor: details.assignedSupervisor || app.assignedSupervisor,
            supervisorNip: details.supervisorNip || app.supervisorNip,
            approvalNotes: status === 'APPROVED' ? details.notes : app.approvalNotes,
            rejectionReason: status === 'REJECTED' ? details.notes : app.rejectionReason,
          };
        }
        return app;
      })
    );
  };

  // Update Division Quota (Admin)
  const handleUpdateDivisionQuota = (divisionId: string, newMax: number) => {
    setDivisions((prev) =>
      prev.map((d) => (d.id === divisionId ? { ...d, quotaMax: newMax } : d))
    );
  };

  // Reset to default
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke data demo awal?')) {
      setApplications(INITIAL_APPLICATIONS);
      setDivisions(INITIAL_DIVISIONS);
      localStorage.removeItem('disarpus_pkl_applications');
      localStorage.removeItem('disarpus_pkl_divisions');
      alert('Data berhasil di-reset!');
    }
  };

  // Total Quota count
  const totalMaxQuota = divisions.reduce((acc, curr) => acc + curr.quotaMax, 0);
  const totalApprovedApps = applications.filter((a) => a.status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-slate-900">
      
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onQuickTrack={handleQuickTrack}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Render Admin Mode Portal */}
        {isAdminMode ? (
          <AdminPortal
            applications={applications}
            divisions={divisions}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onUpdateDivisionQuota={handleUpdateDivisionQuota}
            onResetData={handleResetData}
            onAddNewApplication={handleNewApplication}
            isAuthenticated={isAdminAuthenticated}
            setIsAuthenticated={setIsAdminAuthenticated}
          />
        ) : (
          <>
            {/* TAB 1: BERANDA / HOME */}
            {activeTab === 'beranda' && (
              <div className="space-y-10">
                
                {/* Hero Header Banner */}
                <HeaderBanner
                  onStartApply={() => setActiveTab('pengajuan')}
                  onTrackStatus={() => setActiveTab('lacak')}
                  totalApproved={totalApprovedApps}
                  totalQuota={totalMaxQuota}
                />

                {/* Step-by-Step Procedure Guide */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
                  <div className="text-center max-w-2xl mx-auto space-y-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                      Prosedur Transparan & Terpadu
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      4 Langkah Mudah Pengajuan Surat Izin PKL
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm">
                      Seluruh alur pendaftaran dilakukan secara digital tanpa perlu antre di kantor dinas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        num: '01',
                        title: 'Isi Formulir Online',
                        desc: 'Lengkapi identitas pemohon, pilihan divisi, dan lampirkan Surat Pengantar Kampus/Sekolah.',
                        icon: FileCheck2,
                        color: 'text-emerald-700 bg-emerald-50'
                      },
                      {
                        num: '02',
                        title: 'Verifikasi Berkas',
                        desc: 'Tim verifikator Dinas Kearsipan & Perpustakaan memeriksa keabsahan dokumen dalam 1-2 hari.',
                        icon: Clock,
                        color: 'text-emerald-700 bg-emerald-50'
                      },
                      {
                        num: '03',
                        title: 'Disposisi Pimpinan',
                        desc: 'Kepala Dinas / Sekretaris menentukan persetujuan dan menunjuk Pembimbing Lapangan (Pamong).',
                        icon: ShieldCheck,
                        color: 'text-emerald-700 bg-emerald-50'
                      },
                      {
                        num: '04',
                        title: 'Cetak Surat Balasan',
                        desc: 'Unduh Surat Balasan Resmi ber-QR Code dan bersiap mengikuti kegiatan PKL hari pertama.',
                        icon: Award,
                        color: 'text-emerald-700 bg-emerald-50'
                      }
                    ].map((step) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.num}
                          className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-3 relative hover:border-emerald-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className={`p-2.5 rounded-lg ${step.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-slate-300 font-mono">
                              {step.num}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Division Highlights Quick Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Pilihan Bidang Kerja PKL
                      </h2>
                      <p className="text-xs text-slate-500">
                        Pilih bidang kerja yang sesuai dengan disiplin ilmu perguruan tinggi / SMK Anda.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('divisi')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Lihat Semua Kuota</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {divisions.slice(0, 2).map((div) => (
                      <div
                        key={div.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                              {div.code}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              Sisa Kuota: {div.quotaMax - div.quotaFilled} Orang
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{div.name}</h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{div.description}</p>
                        </div>

                        <button
                          onClick={() => setActiveTab('divisi')}
                          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <span>Rincian Tugas & Persyaratan</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Recent Registered Applicants */}
                <div className="bg-emerald-900 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">
                        Transparansi Publik
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold">
                        Status Pengajuan Terkini Pemohon PKL
                      </h2>
                    </div>

                    <button
                      onClick={() => setActiveTab('lacak')}
                      className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold px-3.5 py-1.5 rounded-lg text-xs border border-emerald-700 flex items-center gap-1"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Lacak Permohonan Saya</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {applications.slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        onClick={() => handleQuickTrack(app.registrationCode)}
                        className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-800 cursor-pointer hover:border-emerald-400 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-emerald-300 font-bold">{app.registrationCode}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'APPROVED'
                                ? 'bg-emerald-800 text-emerald-200 border border-emerald-600'
                                : 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="font-bold text-white text-sm truncate">{app.fullName}</p>
                        <p className="text-emerald-200/80 text-[11px] truncate">
                          {app.institutionName} • {app.major}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: APPLICATION FORM */}
            {activeTab === 'pengajuan' && (
              <ApplicationForm
                divisions={divisions}
                onSubmitSuccess={handleNewApplication}
                onViewStatus={handleQuickTrack}
                onOpenAdmin={handleOpenAdmin}
              />
            )}

            {/* TAB 3: TRACK STATUS */}
            {activeTab === 'lacak' && (
              <StatusTracker
                applications={applications}
                divisions={divisions}
                initialCode={trackCode}
              />
            )}

            {/* TAB 4: DIVISIONS & QUOTA */}
            {activeTab === 'divisi' && (
              <DivisionsInfo
                divisions={divisions}
                onSelectDivisionToApply={(divId) => {
                  setActiveTab('pengajuan');
                }}
              />
            )}

            {/* TAB 5: FAQ & GUIDE */}
            {activeTab === 'faq' && <FaqSection faqs={INITIAL_FAQS} />}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer onNavigateTab={(tab) => { setActiveTab(tab); setIsAdminMode(false); }} />

    </div>
  );
}
