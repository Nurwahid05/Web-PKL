export type ApplicationStatus = 'PENDING' | 'VERIFYING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export type ApplicantType = 'PERORANGAN' | 'KELOMPOK';

export type EducationLevel = 'SMK' | 'D3' | 'D4' | 'S1';

export interface GroupMember {
  id: string;
  fullName: string;
  identityNumber: string; // NIM / NISN
  email: string;
  phone: string;
  role?: string;
}

export interface DocumentUpload {
  id: string;
  name: string;
  type: 'SURAT_PENGANTAR' | 'PROPOSAL' | 'KTP_KTM' | 'TRANSKRIP';
  size: string;
  uploadDate: string;
  fileUrl?: string;
}

export interface LogbookEntry {
  id: string;
  date: string;
  activity: string;
  hours: number;
  status: 'PENDING' | 'APPROVED';
  notes?: string;
}

export interface PKLApplication {
  id: string; // e.g., PKL-DISARPUS-2026-001
  registrationCode: string;
  applicantType: ApplicantType;
  fullName: string;
  identityNumber: string; // NIM or NISN
  email: string;
  phone: string;
  institutionName: string; // e.g. Universitas Simalungun (USI), STIKOM Tunas Bangsa, SMK N 1 Siantar
  educationLevel: EducationLevel;
  major: string; // e.g. Ilmu Perpustakaan, Teknik Informatika, Administrasi Perkantoran
  
  // Group members if type is KELOMPOK
  members: GroupMember[];

  // PKL Choice Details
  preferredDivisionId: string;
  secondaryDivisionId?: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  purposeSummary: string;

  // Documents
  documents: DocumentUpload[];

  // Administrative details
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  assignedSupervisor?: string;
  supervisorNip?: string;
  rejectionReason?: string;
  approvalNotes?: string;
  officialLetterNumber?: string;
  
  // Intern Logbooks
  logbooks?: LogbookEntry[];
  certificateIssued?: boolean;
}

export interface DivisionInfo {
  id: string;
  name: string;
  code: string;
  description: string;
  quotaMax: number;
  quotaFilled: number;
  headName: string;
  suitableMajors: string[];
  tasksList: string[];
  iconName: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'PERSYARATAN' | 'PROSES' | 'PELAKSANAAN';
}
