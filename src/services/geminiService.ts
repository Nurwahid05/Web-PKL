import { GoogleGenAI } from '@google/genai';

// Safe helper for client / server execution
function getGeminiClient(): GoogleGenAI | null {
  // Check runtime environment or import.meta.env
  const apiKey = typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY
    ? process.env.GEMINI_API_KEY
    : (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function generatePurposeDraft(data: {
  fullName: string;
  institution: string;
  major: string;
  educationLevel: string;
  divisionName: string;
  durationMonths: number;
}): Promise<string> {
  const ai = getGeminiClient();

  if (!ai) {
    // Elegant realistic fallback draft
    return `Saya, ${data.fullName} dari jurusan ${data.major} (${data.institution}), mengajukan permohonan Praktik Kerja Lapangan (PKL) selama ${data.durationMonths} bulan di ${data.divisionName}, Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar. Tujuan utama PKL ini adalah untuk mengaplikasikan ilmu akademis secara nyata dalam peningkatan mutu pelayanan publik, digitalisasi kearsipan daerah, serta mendukung pengembangan budaya literasi di Kota Pematang Siantar.`;
  }

  try {
    const prompt = `Buatkan 1 paragraf ringkasan tujuan dan alasan pengajuan PKL (Praktik Kerja Lapangan) yang sangat profesional, formal, dan santun.
Data Pemohon:
- Nama: ${data.fullName}
- Institusi/Kampus/Sekolah: ${data.institution}
- Jurusan: ${data.major} (${data.educationLevel})
- Divisi Target: ${data.divisionName} di Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar
- Durasi: ${data.durationMonths} Bulan

Tuliskan dalam bahasa Indonesia formal tanpa tanda petik, langsung siap pakai untuk pengisian formulir.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text ? response.text.trim() : `Mengajukan PKL di ${data.divisionName} untuk menerapkan kompetensi ${data.major} dari ${data.institution} dalam mendukung efisiensi pelayanan Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar.`;
  } catch (error) {
    console.warn('Gemini API notice:', error);
    return `Saya, ${data.fullName} dari jurusan ${data.major} (${data.institution}), mengajukan permohonan PKL di ${data.divisionName} Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar untuk memperdalam wawasan praktis, mendukung pengelolaan arsip & layanan pustaka, serta memberikan kontribusi nyata bagi masyarakat Kota Pematang Siantar.`;
  }
}

export async function recommendDivisionForMajor(major: string): Promise<{
  recommendedDivisionCode: string;
  reason: string;
}> {
  const ai = getGeminiClient();

  if (!ai) {
    const majorLower = major.toLowerCase();
    if (majorLower.includes('informa') || majorLower.includes('komputer') || majorLower.includes('rpl') || majorLower.includes('sistem')) {
      return {
        recommendedDivisionCode: 'BTI',
        reason: 'Jurusan berbasis teknologi sangat relevan dengan Bidang Pengembangan Layanan & Otomasi TI untuk digitalisasi e-Pusda & sistem jaringan kearsipan.'
      };
    } else if (majorLower.includes('perpus') || majorLower.includes('sastra') || majorLower.includes('baca')) {
      return {
        recommendedDivisionCode: 'BPERPUS',
        reason: 'Sangat cocok untuk Bidang Pelayanan & Pengolahan Bahan Perpustakaan dalam klasifikasi buku, sirkulasi, dan kegiatan literasi pemustaka.'
      };
    } else if (majorLower.includes('arsip') || majorLower.includes('sekret') || majorLower.includes('otkp') || majorLower.includes('kantor')) {
      return {
        recommendedDivisionCode: 'BARSIP',
        reason: 'Sesuai dengan Bidang Kearsipan & Preservasi Dokumen untuk pengelolaan fisik serta digitalisasi arsip penting Pemko Pematang Siantar.'
      };
    } else {
      return {
        recommendedDivisionCode: 'SEKRETARIAT',
        reason: 'Sesuai dengan Sekretariat Dinas untuk mendukung administrasi umum, perencanaan, dan pelayanan publik resmi.'
      };
    }
  }

  try {
    const prompt = `Analisis jurusan studi: "${major}".
Tentukan divisi paling cocok di Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar dari 4 pilihan kode berikut:
1. BARSIP (Bidang Kearsipan & Preservasi Dokumen)
2. BPERPUS (Bidang Pelayanan & Pengolahan Bahan Perpustakaan)
3. BTI (Bidang Pengembangan Layanan & Otomasi TI)
4. SEKRETARIAT (Sekretariat & Administrasi Umum)

Jawab HANYA dalam format JSON valid tanpa markdown, contoh:
{"recommendedDivisionCode": "BARSIP", "reason": "Alasan singkat 1 kalimat..."}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text ? response.text.replace(/```json|```/g, '').trim() : '';
    const parsed = JSON.parse(text);
    return {
      recommendedDivisionCode: parsed.recommendedDivisionCode || 'BARSIP',
      reason: parsed.reason || 'Sangat relevan dengan program kerja kearsipan dan perpustakaan daerah.'
    };
  } catch (error) {
    return {
      recommendedDivisionCode: 'BARSIP',
      reason: 'Kompetensi jurusan Anda mendukung operasional utama Dinas Kearsipan dan Perpustakaan Kota Pematang Siantar.'
    };
  }
}
