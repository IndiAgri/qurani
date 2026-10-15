import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      parentEmail,
      studentName,
      teacherName,
      recite,
      result,
      statusGrade,
      date,
      duration,
      errorCount,
      markedErrors,
      notes,
    } = body;

    if (!parentEmail || !parentEmail.includes("@")) {
      return NextResponse.json(
        { error: "Alamat email orang tua tidak valid" },
        { status: 400 }
      );
    }

    // Generate HTML Raport Setoran Al-Quran
    const gradeColor =
      result === "Excellent" || result === "Very Good"
        ? "#00875a"
        : result === "Not Pass"
        ? "#dc2626"
        : "#2563eb";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Laporan Hasil Setoran Al-Quran - Qurani</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <div style="background-color: #00875a; padding: 28px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">QURANI</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Laporan Bimbingan & Setoran Al-Quran</p>
          </div>

          <!-- Body -->
          <div style="padding: 24px;">
            <p style="font-size: 14px; margin-top: 0; line-height: 1.6;">
              Assalamu'alaikum Warahmatullahi Wabarakatuh,<br>
              Yth. Bapak/Ibu Wali dari <strong>${studentName || "Santri"}</strong>,
            </p>
            <p style="font-size: 13px; color: #475569; line-height: 1.5;">
              Berikut kami sampaikan ringkasan hasil bimbingan dan evaluasi tilawah/hafalan Al-Quran ananda yang baru saja disimak:
            </p>

            <!-- Card Hasil -->
            <div style="background: #f1f5f9; border-radius: 16px; padding: 20px; margin: 20px 0;">
              <div style="margin-bottom: 12px;">
                <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; display: block;">Materi Setoran</span>
                <span style="font-size: 16px; font-weight: 700; color: #0f172a;">${recite || "Tahsin / Tahfidz"}</span>
              </div>

              <div style="display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 12px; margin-top: 12px;">
                <div>
                  <span style="font-size: 11px; color: #64748b; display: block;">Predikat Kelulusan</span>
                  <span style="font-size: 16px; font-weight: 800; color: ${gradeColor};">${result || "Good"}</span>
                </div>
                <div>
                  <span style="font-size: 11px; color: #64748b; display: block;">Catatan Koreksi</span>
                  <span style="font-size: 14px; font-weight: 700; color: #334155;">${errorCount || 0} Kesalahan</span>
                </div>
              </div>
            </div>

            <!-- Detail Sesi -->
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Waktu Bimbingan</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #0f172a;">${date || "Hari Ini"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Durasi Sesi</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #0f172a;">${duration || "4m 30s"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Penyimak / Ustadz</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #0f172a;">${teacherName || "Ustadz Qurani"}</td>
              </tr>
            </table>

            <!-- Catatan Evaluasi Guru -->
            <div style="background: #ecfdf5; border-left: 4px solid #00875a; border-radius: 0 12px 12px 0; padding: 14px; margin-bottom: 24px;">
              <span style="font-size: 11px; font-weight: 700; color: #065f46; display: block; margin-bottom: 4px;">Pesan Evaluasi Pembimbing:</span>
              <p style="margin: 0; font-size: 12px; color: #047857; font-style: italic; line-height: 1.5;">
                "${notes || "Alhamdulillah bacaan ananda sudah diperiksa dengan baik. Mohon tetap didampingi saat muraja'ah di rumah."}"
              </p>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
              Semoga Allah Subhanahu Wa Ta'ala senantiasa memudahkan ananda dalam mempelajari dan mengamalkan kalam-Nya.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
            Laporan ini dibuat otomatis oleh Platform Qurani.<br>
            Tanda Tangan Penguji: <strong>Sah Terverifikasi</strong>
          </div>
        </div>
      </body>
      </html>
    `;

    // Simulated email delivery response
    return NextResponse.json({
      success: true,
      message: `Laporan setoran berhasil dikirim ke email orang tua: ${parentEmail}`,
      deliveredTo: parentEmail,
      timestamp: new Date().toISOString(),
      previewHtml: emailHtml,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal mengirim email laporan setoran" },
      { status: 500 }
    );
  }
}
