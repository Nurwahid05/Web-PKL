import { PKLApplication, DivisionInfo, FAQItem } from '../types';

export const INITIAL_DIVISIONS: DivisionInfo[] = [
  {
    id: 'div-kearsipan',
    name: 'Bidang Kearsipan & Preservasi Dokumen',
    code: 'BARSIP',
    description: 'Bertanggung jawab atas pengelolaan, penataan, digitalisasi, alih media, dan preservasi arsip statis serta dinamis Pemko Pematang Siantar.',
    quotaMax: 10,
    quotaFilled: 6,
    headName: 'Dra. H. Rahmah, M.Si',
    suitableMajors: [
      'Ilmu Kearsipan',
      'Administrasi Perkantoran',
      'Teknik Informatika',
      'Sistem Informasi',
      'Manajemen Informasi'
    ],
    tasksList: [
      'Digitalisasi dan indeks dokumen arsip sejarah kota Pematang Siantar',
      'Penataan fisik dan pembuatan sarana temu balik arsip (JIK & DPA)',
      'Restorasi dan perawatan fisik arsip penting',
      'Pengujian sistem informasi kearsipan dinamis terintegrasi'
    ],
    iconName: 'Archive'
  },
  {
    id: 'div-perpustakaan',
    name: 'Bidang Pelayanan & Pengolahan Bahan Perpustakaan',
    code: 'BPERPUS',
    description: 'Mengelola koleksi literatur, pelayanan sirkulasi pemustaka, katalogisasi digital (OPAC), serta program promosi minat baca masyarakat.',
    quotaMax: 12,
    quotaFilled: 8,
    headName: 'Siti Zubaidah, S.Sos, M.AP',
    suitableMajors: [
      'Ilmu Perpustakaan & Informasi',
      'Sastra & Bahasa Indonesia',
      'Pendidikan',
      'Ilmu Komunikasi',
      'Hubungan Masyarakat'
    ],
    tasksList: [
      'Pengolahan bahan pustaka baru (Klasifikasi DDC, Inventarisasi & Labeling)',
      'Pelayanan keanggotaan dan sirkulasi peminjaman buku',
      'Pengelolaan armada Perpustakaan Keliling ke sekolah & kelurahan Siantar',
      'Penyelenggaraan acara bedah buku dan kampanye literasi anak'
    ],
    iconName: 'BookOpen'
  },
  {
    id: 'div-ti-layanan',
    name: 'Bidang Pengembangan Layanan & Otomasi TI',
    code: 'BTI',
    description: 'Mengembangkan perpustakaan digital (e-pusda), otomasi kearsipan daerah, pengelolaan website resmi, dan infrastruktur IT dinas.',
    quotaMax: 8,
    quotaFilled: 5,
    headName: 'Budi Santoso, S.Kom, M.T',
    suitableMajors: [
      'Teknik Informatika',
      'Sistem Informasi',
      'Rekayasa Perangkat Lunak',
      'Teknologi Komputer',
      'Desain Komunikasi Visual'
    ],
    tasksList: [
      'Pengembangan & pemeliharaan aplikasi e-Pusda Pematang Siantar',
      'Pengelolaan jaringan internet dan server katalog digital',
      'Desain konten kreatif promosi literasi di media sosial resmi dinas',
      'Pendataan statistik pemustaka dan analisis data pengakses'
    ],
    iconName: 'Cpu'
  },
  {
    id: 'div-sekretariat',
    name: 'Sekretariat & Subbag Umum',
    code: 'SEKRETARIAT',
    description: 'Mendukung administrasi umum, kepegawaian, surat-menyurat dinas, perencanaan program kerja, dan kehumasan.',
    quotaMax: 6,
    quotaFilled: 3,
    headName: 'Drs. Agus Sianipar, M.Si',
    suitableMajors: [
      'Administrasi Publik / Negara',
      'Manajemen',
      'Akuntansi',
      'Ilmu Pemerintahan',
      'Sekretaris / OTKP'
    ],
    tasksList: [
      'Pengelolaan agenda kerja dan surat masuk/keluar pimpinan',
      'Penyusunan rekapitulasi data kepegawaian dinas',
      'Penyusunan laporan kinerja instansi pemerintah (LKjIP)',
      'Pelayanan tamu dan protokol kegiatan resmi dinas'
    ],
    iconName: 'Briefcase'
  }
];

export const INITIAL_APPLICATIONS: PKLApplication[] = [
  {
    id: 'app-001',
    registrationCode: 'PKL-DISARPUS-2026-8812',
    applicantType: 'PERORANGAN',
    fullName: 'Rian Pratama Nainggolan',
    identityNumber: '2205101044',
    email: 'rian.nainggolan@usi.ac.id',
    phone: '081263459011',
    institutionName: 'Universitas Simalungun (USI) Pematangsiantar',
    educationLevel: 'S1',
    major: 'Teknik Informatika',
    members: [],
    preferredDivisionId: 'div-ti-layanan',
    secondaryDivisionId: 'div-kearsipan',
    startDate: '2026-08-10',
    endDate: '2026-11-10',
    durationMonths: 3,
    purposeSummary: 'Mengaplikasikan sistem klasifikasi otomatis dokumen kearsipan daerah dan membantu peningkatan pelayanan perpustakaan digital berbasis web.',
    documents: [
      {
        id: 'doc-01',
        name: 'Surat_Pengantar_Kampus_USI.pdf',
        type: 'SURAT_PENGANTAR',
        size: '1.2 MB',
        uploadDate: '2026-07-20'
      },
      {
        id: 'doc-02',
        name: 'Proposal_PKL_Digitalisasi_Arsip.pdf',
        type: 'PROPOSAL',
        size: '2.5 MB',
        uploadDate: '2026-07-20'
      }
    ],
    status: 'APPROVED',
    submittedAt: '2026-07-20 10:15',
    reviewedAt: '2026-07-22 14:30',
    reviewedBy: 'Drs. Agus Sianipar, M.Si (Sekretaris Dinas)',
    assignedSupervisor: 'Budi Santoso, S.Kom, M.T',
    supervisorNip: '19820412 200801 1 009',
    approvalNotes: 'Permohonan disetujui. Silakan hadir pada pembekalan hari pertama pukul 08.00 WIB dengan mengenakan pakaian almamater kampus.',
    officialLetterNumber: '005.1/842/DISARPUS-PS/2026',
    logbooks: [
      {
        id: 'lb-1',
        date: '2026-08-10',
        activity: 'Orientasi umum lingkungan Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar & perkenalan pembimbing',
        hours: 7,
        status: 'APPROVED'
      }
    ]
  },
  {
    id: 'app-002',
    registrationCode: 'PKL-DISARPUS-2026-7329',
    applicantType: 'KELOMPOK',
    fullName: 'Siti Nurhaliza Damanik',
    identityNumber: '210102019',
    email: 'sitinurhaliza@nommensen.ac.id',
    phone: '085270112233',
    institutionName: 'Universitas HKBP Nommensen Pematangsiantar',
    educationLevel: 'S1',
    major: 'Pendidikan Bahasa & Sastra Indonesia',
    members: [
      {
        id: 'm-1',
        fullName: 'Grace Veronica Saragih',
        identityNumber: '210102022',
        email: 'grace.saragih@nommensen.ac.id',
        phone: '081399887711'
      },
      {
        id: 'm-2',
        fullName: 'Yosua Purba',
        identityNumber: '210102035',
        email: 'yosua.purba@nommensen.ac.id',
        phone: '082165439900'
      }
    ],
    preferredDivisionId: 'div-perpustakaan',
    secondaryDivisionId: 'div-sekretariat',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    durationMonths: 3,
    purposeSummary: 'Penyelenggaraan gerakan penguatan literasi membaca anak sekolah dasar di Kota Pematang Siantar dan inventarisasi bahan pustaka lokal.',
    documents: [
      {
        id: 'doc-03',
        name: 'Surat_Izin_Pengantar_Nommensen.pdf',
        type: 'SURAT_PENGANTAR',
        size: '1.8 MB',
        uploadDate: '2026-07-24'
      }
    ],
    status: 'VERIFYING',
    submittedAt: '2026-07-24 11:40',
    approvalNotes: 'Sedang dalam peninjauan jadwal kuota ruangan perpustakaan.'
  },
  {
    id: 'app-003',
    registrationCode: 'PKL-DISARPUS-2026-5102',
    applicantType: 'PERORANGAN',
    fullName: 'Fahri Alamsyah',
    identityNumber: '202300188',
    email: 'fahri.alamsyah@smkn1siantar.sch.id',
    phone: '082276510099',
    institutionName: 'SMK Negeri 1 Pematang Siantar',
    educationLevel: 'SMK',
    major: 'Otomatisasi & Tata Kelola Perkantoran (OTKP)',
    members: [],
    preferredDivisionId: 'div-kearsipan',
    startDate: '2026-08-15',
    endDate: '2026-10-15',
    durationMonths: 2,
    purposeSummary: 'Praktek kerja lapangan dalam penataan kearsipan dinamis dan tata persuratan instansi pemerintahan.',
    documents: [
      {
        id: 'doc-04',
        name: 'SuratPengantar_SMKN1_Siantar.pdf',
        type: 'SURAT_PENGANTAR',
        size: '950 KB',
        uploadDate: '2026-07-26'
      }
    ],
    status: 'PENDING',
    submittedAt: '2026-07-26 09:20'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    category: 'PERSYARATAN',
    question: 'Siapa saja yang dapat mengajukan PKL / Magang di Disarpus Kota Pematang Siantar?',
    answer: 'Mahasiswa D3/D4/S1 serta Siswa SMK dari perguruan tinggi atau sekolah terakreditasi, baik dari wilayah Pematang Siantar / Simalungun maupun daerah lain di Indonesia.'
  },
  {
    category: 'PERSYARATAN',
    question: 'Dokumen apa saja yang wajib dilampirkan saat pendaftaran online?',
    answer: 'Dokumen wajib meliputi: (1) Surat Pengantar Resmi dari Kampus/Sekolah yang ditujukan kepada Kepala Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar, (2) Proposal Kegiatan PKL/Magang, dan (3) Kartu Tanda Mahasiswa (KTM) / Kartu Pelajar.'
  },
  {
    category: 'PROSES',
    question: 'Berapa lama proses verifikasi dan penerbitan Surat Balasan?',
    answer: 'Proses verifikasi berkas dan disposisi pimpinan membutuhkan waktu rata-rata 2 hingga 4 hari kerja. Anda dapat memantau status secara realtime melalui fitur Lacak Status menggunakan Kode Registrasi.'
  },
  {
    category: 'PELAKSANAAN',
    question: 'Berapa lama durasi maksimal PKL yang diperbolehkan?',
    answer: 'Durasi standar PKL adalah 1 hingga 3 bulan. Untuk durasi lebih dari 3 bulan dapat didiskusikan sesuai persetujuan pimpinan dinas dan kapasitas kuota.'
  },
  {
    category: 'PELAKSANAAN',
    question: 'Apakah peserta PKL mendapatkan sertifikat resmi?',
    answer: 'Ya, setiap peserta yang telah menyelesaikan masa PKL dengan presensi dan penilaian baik dari Pembimbing Lapangan akan mendapatkan Sertifikat Selesai PKL ber-QR Code dari Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar.'
  }
];
