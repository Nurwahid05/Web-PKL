import React from 'react';
import { DivisionInfo } from '../types';
import { 
  Archive, 
  BookOpen, 
  Cpu, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface DivisionsInfoProps {
  divisions: DivisionInfo[];
  onSelectDivisionToApply: (divisionId: string) => void;
}

export const DivisionsInfo: React.FC<DivisionsInfoProps> = ({
  divisions,
  onSelectDivisionToApply,
}) => {
  const getDivisionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Archive':
        return <Archive className="w-6 h-6 text-blue-700" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-emerald-700" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-indigo-700" />;
      default:
        return <Briefcase className="w-6 h-6 text-amber-700" />;
    }
  };

  return (
    <div className="space-y-8 my-6">
      
      {/* Intro Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
          Struktur Organisasi & Kuota Peserta
        </span>
        <h2 className="text-2xl sm:text-3xl font-black">
          Bidang Kerja & Kuota PKL Dinas Disarpus Siantar
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Setiap bidang di Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar dirancang untuk memberikan pengalaman kerja nyata yang sesuai dengan kompetensi jurusan akademik Anda.
        </p>
      </div>

      {/* Division Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {divisions.map((div) => {
          const quotaPercent = Math.round((div.quotaFilled / div.quotaMax) * 100);
          const isFull = div.quotaFilled >= div.quotaMax;

          return (
            <div
              key={div.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col justify-between space-y-5 hover:border-blue-300 transition-all"
            >
              <div className="space-y-4">
                
                {/* Header Badge & Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                      {getDivisionIcon(div.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        KODE: {div.code}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug mt-1">
                        {div.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {div.description}
                </p>

                {/* Head of Division */}
                <div className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <UserCheck className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="text-slate-500">Kepala Bidang:</span>
                  <strong className="text-slate-900 font-bold">{div.headName}</strong>
                </div>

                {/* Quota Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Kapasitas Kuota Periode Ini:</span>
                    <span className={`font-extrabold ${isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {div.quotaFilled} dari {div.quotaMax} Terisi ({quotaPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? 'bg-rose-500'
                          : quotaPercent > 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, quotaPercent)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Suitable Majors Tags */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                    Jurusan Yang Sangat Sesuai:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {div.suitableMajors.map((m) => (
                      <span
                        key={m}
                        className="bg-slate-100 text-slate-800 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Tasks */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                    Tugas & Aktivitas Utama PKL:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {div.tasksList.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectDivisionToApply(div.id)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>Pilih Bidang Ini & Ajukan Surat</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
