import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  PKLApplication, 
  DivisionInfo, 
  ApplicantType, 
  EducationLevel, 
  GroupMember, 
  DocumentUpload 
} from '../types';
import { generatePurposeDraft, recommendDivisionForMajor } from '../services/geminiService';
import { 
  FileText, 
  User, 
  Users, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Upload, 
  Trash2, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  FileCheck,
  Search,
  ShieldCheck
} from 'lucide-react';

interface ApplicationFormProps {
  divisions: DivisionInfo[];
  onSubmitSuccess: (newApp: PKLApplication) => void;
  onViewStatus: (code: string) => void;
  onOpenAdmin?: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  divisions,
  onSubmitSuccess,
  onViewStatus,
  onOpenAdmin,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicantType, setApplicantType] = useState<ApplicantType>('PERORANGAN');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('S1');
  const [major, setMajor] = useState('');

  // Group Members State
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // PKL Selection State
  const [preferredDivisionId, setPreferredDivisionId] = useState(divisions[0]?.id || 'div-kearsipan');
  const [secondaryDivisionId, setSecondaryDivisionId] = useState(divisions[1]?.id || 'div-perpustakaan');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purposeSummary, setPurposeSummary] = useState('');

  // Documents Upload State
  const [uploadedFiles, setUploadedFiles] = useState<DocumentUpload[]>([
    {
      id: 'doc-surat-pengantar',
      name: 'Surat_Pengantar_Resmi_Kampus_Sekolah.pdf',
      type: 'SURAT_PENGANTAR',
      size: '1.4 MB',
      uploadDate: new Date().toISOString().split('T')[0]
    }
  ]);

  // AI Loading & Result states
  const [aiDrafting, setAiDrafting] = useState(false);
  const [aiRecommending, setAiRecommending] = useState(false);
  const [aiRecommendationNote, setAiRecommendationNote] = useState<string | null>(null);

  // Submission State
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [createdAppCode, setCreatedAppCode] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Institution quick suggestions
  const INSTITUTION_SUGGESTIONS = [
    'Universitas Simalungun (USI) Pematangsiantar',
    'Universitas HKBP Nommensen Pematangsiantar',
    'STIKOM Tunas Bangsa Pematangsiantar',
    'Universitas Murni Teguh Pematangsiantar',
    'SMK Negeri 1 Pematang Siantar',
    'SMK Negeri 2 Pematang Siantar',
    'Politeknik Negeri Medan',
    'Universitas Sumatera Utara (USU)'
  ];

  // Calculate Duration in months
  const calculateDurationMonths = (): number => {
    if (!startDate || !endDate) return 2;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.round(diffDays / 30));
  };

  // Add Group Member
  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberId.trim()) {
      setValidationError('Nama dan NIM/NISN anggota kelompok wajib diisi.');
      return;
    }
    const member: GroupMember = {
      id: `m-${Date.now()}`,
      fullName: newMemberName.trim(),
      identityNumber: newMemberId.trim(),
      email: newMemberEmail.trim() || `${newMemberId.trim()}@siswa.ac.id`,
      phone: '-'
    };
    setMembers([...members, member]);
    setNewMemberName('');
    setNewMemberId('');
    setNewMemberEmail('');
    setValidationError(null);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  // Handle Mock File Upload
  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentUpload['type']) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newDoc: DocumentUpload = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setUploadedFiles([...uploadedFiles.filter((d) => d.type !== type), newDoc]);
    }
  };

  // AI Helper: Recommend Division based on Major
  const handleAiRecommendDivision = async () => {
    if (!major.trim()) {
      setValidationError('Silakan isi Nama Jurusan Anda terlebih dahulu.');
      return;
    }
    setValidationError(null);
    setAiRecommending(true);
    try {
      const res = await recommendDivisionForMajor(major);
      const matchedDiv = divisions.find((d) => d.code === res.recommendedDivisionCode) || divisions[0];
      if (matchedDiv) {
        setPreferredDivisionId(matchedDiv.id);
        setAiRecommendationNote(res.reason);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiRecommending(false);
    }
  };

  // AI Helper: Generate Purpose Summary Draft
  const handleAiGeneratePurpose = async () => {
    if (!fullName || !institutionName || !major) {
      setValidationError('Mohon lengkapi Nama, Instansi/Kampus, dan Jurusan pada Langkah 1.');
      return;
    }
    setValidationError(null);
    setAiDrafting(true);
    try {
      const targetDiv = divisions.find((d) => d.id === preferredDivisionId)?.name || 'Dinas Perpustakaan';
      const draft = await generatePurposeDraft({
        fullName,
        institution: institutionName,
        major,
        educationLevel,
        divisionName: targetDiv,
        durationMonths: calculateDurationMonths()
      });
      setPurposeSummary(draft);
    } catch (err) {
      console.error(err);
    } finally {
      setAiDrafting(false);
    }
  };

  // Step Validation
  const validateStep = (step: number) => {
    setValidationError(null);
    if (step === 1) {
      if (!fullName.trim()) return 'Nama lengkap pemohon tidak boleh kosong.';
      if (!identityNumber.trim()) return 'NIM / NISN wajib diisi.';
      if (!email.trim() || !email.includes('@')) return 'Alamat email aktif wajib diisi dengan benar.';
      if (!phone.trim()) return 'Nomor HP/WhatsApp wajib diisi.';
      if (!institutionName.trim()) return 'Nama Perguruan Tinggi / Sekolah wajib diisi.';
      if (!major.trim()) return 'Jurusan / Program Studi wajib diisi.';
      if (applicantType === 'KELOMPOK' && members.length === 0) {
        return 'Permohonan kelompok wajib menyertakan minimal 1 anggota tambahan.';
      }
    } else if (step === 2) {
      if (!startDate || !endDate) return 'Tanggal Mulai dan Tanggal Selesai PKL wajib ditentukan.';
      if (new Date(startDate) >= new Date(endDate)) return 'Tanggal Selesai harus setelah Tanggal Mulai PKL.';
      if (!purposeSummary.trim()) return 'Ringkasan Tujuan & Alasan PKL wajib diisi.';
    } else if (step === 3) {
      const hasSuratPengantar = uploadedFiles.some((d) => d.type === 'SURAT_PENGANTAR');
      if (!hasSuratPengantar) return 'Surat Pengantar Resmi dari Kampus/Sekolah wajib diunggah.';
    }
    return null;
  };

  const handleNextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Submission
  const handleSubmitApplication = () => {
    if (!agreedTerms) {
      setValidationError('Anda wajib menyetujui pernyataan keabsahan dokumen & tata tertib.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regCode = `PKL-DISARPUS-2026-${randomNum}`;

    const newApp: PKLApplication = {
      id: `app-${Date.now()}`,
      registrationCode: regCode,
      applicantType,
      fullName: fullName.trim(),
      identityNumber: identityNumber.trim(),
      email: email.trim(),
      phone: phone.trim(),
      institutionName: institutionName.trim(),
      educationLevel,
      major: major.trim(),
      members,
      preferredDivisionId,
      secondaryDivisionId,
      startDate,
      endDate,
      durationMonths: calculateDurationMonths(),
      purposeSummary: purposeSummary.trim(),
      documents: uploadedFiles,
      status: 'PENDING',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Fire Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setCreatedAppCode(regCode);
    onSubmitSuccess(newApp);
  };

  // Render Confirmation Modal
  if (createdAppCode) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10 max-w-2xl mx-auto my-6 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Pengajuan Berhasil Terkirim
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Surat Izin PKL Anda Telah Didaftarkan
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Permohonan Anda sedang dalam antrean verifikasi oleh Sekretariat Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar.
          </p>
        </div>

        {/* Display Code Card */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md space-y-2">
          <p className="text-xs text-slate-400 font-medium">SIMPAN KODE REGISTRASI ANDA:</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-wider">
              {createdAppCode}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdAppCode);
                alert('Kode Registrasi berhasil disalin!');
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 border border-slate-700"
              title="Salin Kode"
            >
              <Copy className="w-4 h-4 text-amber-400" />
              <span>Salin</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Gunakan kode ini untuk mengecek progres disposisi & mengunduh Surat Balasan Resmi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onViewStatus(createdAppCode)}
            className="w-full sm:w-auto px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>Lacak Status Sekarang</span>
          </button>

          {onOpenAdmin && (
            <button
              onClick={() => {
                setCreatedAppCode(null);
                onOpenAdmin();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Proses Langsung di Dashboard Officer / Admin</span>
            </button>
          )}

          <button
            onClick={() => {
              setCreatedAppCode(null);
              setCurrentStep(1);
              setFullName('');
              setIdentityNumber('');
              setEmail('');
              setPhone('');
              setPurposeSummary('');
            }}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
          >
            Buat Pengajuan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-8 my-6">
      
      {/* Header Form Title */}
      <div className="border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Formulir Elektronik Terpadu</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          Pengajuan Surat Izin PKL / Magang
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar
        </p>
      </div>

      {/* Multi-Step Progress Tracker */}
      <div className="grid grid-cols-4 gap-2 mb-8 text-center">
        {[
          { step: 1, label: 'Identitas Pemohon', icon: User },
          { step: 2, label: 'Divisi & Jadwal', icon: Calendar },
          { step: 3, label: 'Unggah Berkas', icon: Upload },
          { step: 4, label: 'Konfirmasi', icon: FileCheck },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;
          return (
            <div
              key={item.step}
              onClick={() => {
                if (isDone) setCurrentStep(item.step);
              }}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                isDone ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all mb-1.5 shadow-xs ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <span
                className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                  isActive ? 'text-emerald-700 font-bold' : isDone ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Validation Error Notice */}
      {validationError && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Mohon periksa kembali:</strong>
            <p>{validationError}</p>
          </div>
        </div>
      )}

      {/* STEP 1: Applicant Identity */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Kategori Permohonan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setApplicantType('PERORANGAN')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs sm:text-sm font-bold transition-all ${
                  applicantType === 'PERORANGAN'
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Perorangan (1 Orang)</span>
              </button>

              <button
                type="button"
                onClick={() => setApplicantType('KELOMPOK')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs sm:text-sm font-bold transition-all ${
                  applicantType === 'KELOMPOK'
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Kelompok (2+ Orang)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Ketua / Pemohon Utama <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Rian Pratama Nainggolan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIM / NISN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 2205101044"
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Email Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Contoh: nama@kampus.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. HP / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 081263459011"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat Pendidikan <span className="text-rose-500">*</span>
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              >
                <option value="S1 font-semibold">Sarjana (S1)</option>
                <option value="D4">Diploma IV (D4)</option>
                <option value="D3">Diploma III (D3)</option>
                <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Kampus / Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Universitas Simalungun (USI)"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {INSTITUTION_SUGGESTIONS.slice(0, 4).map((inst) => (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => setInstitutionName(inst)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-xs"
                  >
                    + {inst.split(' ')[0]} {inst.split(' ')[1] || ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Jurusan / Program Studi <span className="text-rose-500">*</span>
                </label>
                
                {/* AI Division Recommend Button */}
                <button
                  type="button"
                  onClick={handleAiRecommendDivision}
                  disabled={aiRecommending}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{aiRecommending ? 'Menganalisis Jurusan...' : 'Cek Rekomendasi Divisi AI'}</span>
                </button>
              </div>

              <input
                type="text"
                placeholder="Contoh: Teknik Informatika / Ilmu Perpustakaan / OTKP"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />

              {aiRecommendationNote && (
                <div className="mt-2 text-xs bg-indigo-50 border border-indigo-200 text-indigo-900 p-3 rounded-lg flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Rekomendasi AI:</strong> {aiRecommendationNote}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Group Members Manager Section (If Kelompok) */}
          {applicantType === 'KELOMPOK' && (
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-900" />
                  <span>Daftar Anggota Kelompok ({members.length} Orang)</span>
                </h3>
                <span className="text-xs text-slate-500">Maksimal 5 Anggota per Kelompok</span>
              </div>

              {members.length > 0 && (
                <div className="space-y-2">
                  {members.map((m, index) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">
                          {index + 1}. {m.fullName}
                        </span>
                        <span className="text-slate-500 ml-2">NIM/NISN: {m.identityNumber}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Hapus Anggota"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Member Form */}
              <div className="bg-slate-100 p-3.5 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-slate-700">Tambah Anggota Kelompok Baru:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Anggota..."
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="NIM / NISN..."
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-md text-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Anggota</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Division & Schedule Choice */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Preferred Division */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Pilihan Utama Bidang / Divisi PKL <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {divisions.map((div) => {
                const isSelected = preferredDivisionId === div.id;
                return (
                  <div
                    key={div.id}
                    onClick={() => setPreferredDivisionId(div.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-800 ring-2 ring-blue-600/30 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md">
                        {div.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Kuota: {div.quotaFilled}/{div.quotaMax}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-2">{div.name}</h4>
                    <p className="text-slate-600 text-xs mt-1 line-clamp-2">{div.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary Division */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Pilihan Cadangan Divisi (Opsional)
            </label>
            <select
              value={secondaryDivisionId}
              onChange={(e) => setSecondaryDivisionId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg"
            >
              <option value="">-- Tidak memilih pilihan cadangan --</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.name} ({div.code})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Mulai PKL <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Selesai PKL <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between text-xs text-slate-600 pt-1">
              <span>Estimasi Durasi Masa PKL:</span>
              <span className="font-extrabold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-md">
                {calculateDurationMonths()} Bulan
              </span>
            </div>
          </div>

          {/* Purpose Summary */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Ringkasan Tujuan & Alasan PKL di Disarpus Siantar <span className="text-rose-500">*</span>
              </label>

              {/* AI Draft Generator */}
              <button
                type="button"
                onClick={handleAiGeneratePurpose}
                disabled={aiDrafting}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{aiDrafting ? 'Menyusun Draf...' : 'Buatkan Draf dengan AI'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="Jelaskan alasan memilih Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar dan hasil yang diharapkan..."
              value={purposeSummary}
              onChange={(e) => setPurposeSummary(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {/* STEP 3: Document Uploads */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs space-y-1">
            <strong className="font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              Petunjuk Unggah Berkas Persyaratan:
            </strong>
            <p>
              Dokumen utama yang wajib diunggah adalah <strong>Surat Pengantar Resmi</strong> dari Rektor/Dekan/Kepala Sekolah yang ditujukan kepada Kepala Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar. Format file: PDF atau JPG (Maks 5 MB).
            </p>
          </div>

          {/* Required Documents Upload List */}
          <div className="space-y-3">
            {/* 1. Surat Pengantar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    1. Surat Pengantar Kampus / Sekolah <span className="text-rose-500">*</span>
                  </h4>
                  <p className="text-xs text-slate-500">Wajib. Ditujukan kepada Ka. Dinas Kearsipan & Perpustakaan Siantar.</p>
                </div>
                <label className="cursor-pointer bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    className="hidden"
                    onChange={(e) => handleSimulatedFileUpload(e, 'SURAT_PENGANTAR')}
                  />
                </label>
              </div>

              {/* Uploaded File Item */}
              {uploadedFiles.find((d) => d.type === 'SURAT_PENGANTAR') && (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">
                      {uploadedFiles.find((d) => d.type === 'SURAT_PENGANTAR')?.name}
                    </span>
                    <span className="text-slate-400">
                      ({uploadedFiles.find((d) => d.type === 'SURAT_PENGANTAR')?.size})
                    </span>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">
                    Terunggah
                  </span>
                </div>
              )}
            </div>

            {/* 2. Proposal PKL */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    2. Proposal Kegiatan PKL / Rencana Kerja (Opsional)
                  </h4>
                  <p className="text-xs text-slate-500">Gambaran rencana topik atau proyek kearsipan/perpustakaan.</p>
                </div>
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleSimulatedFileUpload(e, 'PROPOSAL')}
                  />
                </label>
              </div>

              {uploadedFiles.find((d) => d.type === 'PROPOSAL') && (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">
                      {uploadedFiles.find((d) => d.type === 'PROPOSAL')?.name}
                    </span>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">
                    Terunggah
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Final Confirmation */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-amber-300 border-b border-slate-800 pb-2">
              Ringkasan Data Permohonan Surat Izin PKL
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Kategori / Status:</span>
                <span className="font-bold text-white">{applicantType} ({educationLevel})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Nama Pemohon Utama:</span>
                <span className="font-bold text-white">{fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">NIM / NISN:</span>
                <span className="font-bold text-white">{identityNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Kampus / Sekolah:</span>
                <span className="font-bold text-white">{institutionName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Jurusan:</span>
                <span className="font-bold text-white">{major}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Divisi Pilihan Utama:</span>
                <span className="font-bold text-amber-300">
                  {divisions.find((d) => d.id === preferredDivisionId)?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Periode PKL:</span>
                <span className="font-bold text-white">
                  {startDate} s.d {endDate} ({calculateDurationMonths()} Bulan)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Jumlah Berkas Diunggah:</span>
                <span className="font-bold text-emerald-400">{uploadedFiles.length} Dokumen</span>
              </div>
            </div>

            {members.length > 0 && (
              <div className="border-t border-slate-800 pt-3 text-xs">
                <span className="text-slate-400 block mb-1">Anggota Kelompok ({members.length} Orang):</span>
                <p className="text-slate-200">
                  {members.map((m) => `${m.fullName} (${m.identityNumber})`).join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-200">
            <input
              type="checkbox"
              id="terms-check"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-900 rounded-sm border-slate-300 focus:ring-blue-600"
            />
            <label htmlFor="terms-check" className="text-xs text-slate-800 leading-relaxed cursor-pointer">
              Saya menyatakan bahwa seluruh data dan dokumen yang dikirimkan adalah sah dan benar. Saya bersedia mematuhi seluruh tata tertib dan prosedur yang berlaku di Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar.
            </label>
          </div>
        </div>
      )}

      {/* Navigation Buttons Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm"
          >
            Kembali
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>Langkah Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitApplication}
            className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>Kirim Permohonan PKL Sekarang</span>
          </button>
        )}
      </div>

    </div>
  );
};
