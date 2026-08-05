import React from 'react';
import { PKLApplication, DivisionInfo } from '../types';
import { LogoEmblem } from './LogoEmblem';
import { Printer, Download, CheckCircle2, QrCode, Shield, X, Sparkles } from 'lucide-react';

interface OfficialLetterViewProps {
  application: PKLApplication;
  division?: DivisionInfo;
  onClose: () => void;
}

export const OfficialLetterView: React.FC<OfficialLetterViewProps> = ({
  application,
  division,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const letterNumber = application.officialLetterNumber || '005.1/842/DISARPUS-PS/2026';
  const supervisorName = application.assignedSupervisor || 'Budi Santoso, S.Kom, M.T';
  const supervisorNip = application.supervisorNip || '19820412 200801 1 009';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-300">
        
        {/* Top Control Header Bar (Not Printed) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-xs sm:text-sm font-extrabold tracking-wide">
              Pratinjau Surat Balasan Resmi Pemko Pematang Siantar
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE LETTER BODY AREA */}
        <div className="p-6 sm:p-12 overflow-y-auto bg-white text-slate-900 font-serif leading-relaxed text-xs sm:text-sm print:p-8 print:text-black">
          
          {/* Official Letterhead (Kop Surat Pemko Siantar) */}
          <div className="border-b-4 border-double border-slate-900 pb-3 mb-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <LogoEmblem size="lg" className="shrink-0" />
              <div className="font-sans text-center">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-800">
                  PEMERINTAH KOTA PEMATANG SIANTAR
                </h3>
                <h1 className="text-base sm:text-xl font-black uppercase tracking-wider text-slate-950 mt-0.5">
                  DINAS KEARSIPAN DAN PERPUSTAKAAN
                </h1>
                <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                  Jalan Merdeka No. 1 Pematang Siantar, Sumatera Utara 21136
                </p>
                <p className="text-[10px] text-slate-500">
                  Telepon: (0622) 21008 • Email: disarpus@pematangsiantar.go.id • Laman: disarpus.pematangsiantar.go.id
                </p>
              </div>
            </div>
          </div>

          {/* Letter Meta Data Block */}
          <div className="grid grid-cols-12 gap-2 text-xs font-sans mb-6">
            <div className="col-span-8 space-y-0.5">
              <p><span className="w-20 inline-block font-semibold">Nomor</span>: {letterNumber}</p>
              <p><span className="w-20 inline-block font-semibold">Sifat</span>: Biasa</p>
              <p><span className="w-20 inline-block font-semibold">Lampiran</span>: -</p>
              <p><span className="w-20 inline-block font-semibold">Hal</span>: <strong className="font-bold underline">Persetujuan Praktik Kerja Lapangan (PKL)</strong></p>
            </div>
            <div className="col-span-4 text-right">
              <p>Pematang Siantar, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Recipient */}
          <div className="font-sans text-xs space-y-1 mb-6">
            <p>Kepada Yth,</p>
            <p className="font-bold">Pimpinan / Dekan / Kepala Sekolah</p>
            <p className="font-semibold text-slate-800">{application.institutionName}</p>
            <p className="text-slate-600">di Tempat</p>
          </div>

          {/* Letter Content */}
          <div className="space-y-3 text-justify text-slate-800 font-serif leading-relaxed">
            <p>
              Menindaklanjuti Surat Pengantar dari {application.institutionName} terkait permohonan izin Praktik Kerja Lapangan (PKL) / Magang mahasiswa/siswa Anda, bersama ini disampaikan bahwa Kepala Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar menyatakan <strong>MENERIMA & MENYETUJUAN</strong> pelaksanaan PKL untuk nama-nama berikut:
            </p>

            {/* Student Table */}
            <div className="my-4 overflow-x-auto font-sans">
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-300 p-2 text-center w-10">No</th>
                    <th className="border border-slate-300 p-2 text-left">Nama Lengkap</th>
                    <th className="border border-slate-300 p-2 text-center">NIM / NISN</th>
                    <th className="border border-slate-300 p-2 text-left">Program Studi / Jurusan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 text-center font-bold">1</td>
                    <td className="border border-slate-300 p-2 font-bold">{application.fullName} (Ketua)</td>
                    <td className="border border-slate-300 p-2 text-center">{application.identityNumber}</td>
                    <td className="border border-slate-300 p-2">{application.major}</td>
                  </tr>
                  {application.members.map((m, idx) => (
                    <tr key={m.id}>
                      <td className="border border-slate-300 p-2 text-center font-bold">{idx + 2}</td>
                      <td className="border border-slate-300 p-2">{m.fullName}</td>
                      <td className="border border-slate-300 p-2 text-center">{m.identityNumber}</td>
                      <td className="border border-slate-300 p-2">{application.major}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Adapun pelaksanaan Praktik Kerja Lapangan (PKL) disetujui untuk dilaksanakan pada:
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans text-xs space-y-1 my-2">
              <p><strong className="w-36 inline-block">Tanggal Pelaksanaan</strong>: {application.startDate} s.d {application.endDate} ({application.durationMonths} Bulan)</p>
              <p><strong className="w-36 inline-block">Penempatan Bidang</strong>: {division?.name || 'Bidang Dinas Disarpus'}</p>
              <p><strong className="w-36 inline-block">Pembimbing Lapangan</strong>: {supervisorName} (NIP. {supervisorNip})</p>
            </div>

            <p>
              Peserta diwajibkan untuk hadir pada hari pertama pukul 08.00 WIB dengan mengenakan pakaian seragam almamater resmi, menjaga ketertiban, serta mematuhi seluruh tata tertib lingkungan Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar.
            </p>

            <p>
              Demikian surat persetujuan ini disampaikan untuk dipergunakan sebagaimana mestinya. Atas perhatian dan kerja sama yang baik, diucapkan terima kasih.
            </p>
          </div>

          {/* Signature Block & QR Validation */}
          <div className="mt-8 pt-4 grid grid-cols-12 gap-4 items-end font-sans">
            
            {/* QR Code Verification Stamp */}
            <div className="col-span-6 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="p-1 bg-white border border-slate-300 rounded-md shrink-0">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div className="text-[10px] text-slate-600 leading-tight">
                <p className="font-extrabold text-blue-900 uppercase">Verifikasi Keabsahan Digital</p>
                <p>Kode Reg: <strong className="font-mono text-slate-900">{application.registrationCode}</strong></p>
                <p className="text-slate-500 mt-0.5">Dokumen ini diterbitkan sah secara elektronik oleh SIPKL Dinas Kearsipan & Perpustakaan Kota Pematang Siantar.</p>
              </div>
            </div>

            {/* Official Signature */}
            <div className="col-span-6 text-right space-y-1">
              <p className="text-xs">An. Kepala Dinas Kearsipan dan Perpustakaan</p>
              <p className="text-xs font-bold text-slate-900">Kota Pematang Siantar</p>
              <p className="text-xs text-slate-600 font-medium">Sekretaris Dinas / Verifikator Utama</p>
              
              {/* Digital Stamp Graphic */}
              <div className="my-2 flex justify-end">
                <div className="border-2 border-blue-900 text-blue-900 p-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center rotate-[-3deg] opacity-90 shadow-2xs">
                  ★ DINAS KEARSIPAN & PERPUSTAKAAN ★<br />
                  PEMERINTAH KOTA PEMATANG SIANTAR<br />
                  <span className="text-[9px] text-emerald-800">DISAPROVED & DISPOSISI SAH</span>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-900 underline mt-4">Drs. AGUS SIANIPAR, M.Si</p>
              <p className="text-[11px] text-slate-600">NIP. 19740815 199803 1 004</p>
            </div>

          </div>

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between print:hidden">
          <p className="text-xs text-slate-500 hidden sm:block">
            Gunakan tombol Cetak untuk menyimpan berkas sebagai dokumen PDF resmi.
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
