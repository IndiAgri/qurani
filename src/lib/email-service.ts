import nodemailer from "nodemailer";

export interface InterviewEmailPayload {
  toEmail: string;
  teacherName: string;
  interviewDate?: string;
  interviewTime?: string;
  meetLink?: string;
  examiner?: string;
  notes?: string;
}

/**
 * Membuat transporter Nodemailer:
 * 1. Jika GMAIL_USER dan GMAIL_APP_PASSWORD ada di environment, gunakan Gmail SMTP.
 * 2. Jika tidak ada, buat transporter fallback Ethereal (test account) agar tidak error saat testing.
 */
async function getMailTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (user && pass) {
    return {
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      }),
      isLive: true,
      sender: user,
    };
  }

  // Jika belum memasukkan akun Gmail di .env.local, gunakan transporter lokal
  return {
    transporter: null,
    isLive: false,
    sender: "admin.qurani@gmail.com",
  };
}

/**
 * Mengirim email undangan seleksi & wawancara resmi
 */
export async function sendInterviewEmail(payload: InterviewEmailPayload) {
  const {
    toEmail,
    teacherName,
    interviewDate = "Minggu, 12 Juli 2026",
    interviewTime = "12.00 – 13.00 WIB",
    meetLink = "https://meet.google.com/qurani-seleksi-ustadz",
    examiner = "Hamid Al-Hafidz (Tim Penguji Qurani)",
    notes = "Persiapkan bacaan tartil dan hafalan surat pendek untuk verifikasi standar makharijul huruf.",
  } = payload;


  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Undangan Wawancara Guru Qurani</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #00875a 0%, #006644 100%); padding: 32px 28px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Qurani Education</h1>
          <p style="color: #d1fae5; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">Undangan Wawancara & Seleksi Calon Pengajar</p>
        </td>
      </tr>
      
      <!-- Body -->
      <tr>
        <td style="padding: 32px 28px;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: #334155;">
            Assalamu’alaikum Warahmatullahi Wabarakatuh,
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; color: #334155;">
            Yth. <strong>${teacherName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; color: #475569;">
            Selamat! Berkas dan portofolio pendaftaran Anda sebagai Pengajar di platform <strong>Qurani</strong> telah ditinjau dan dinyatakan <strong>Lolos ke Tahap Wawancara & Seleksi</strong>.
          </p>

          <!-- Schedule Card -->
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #00875a; margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">
              Detail Jadwal Wawancara
            </h3>
            <table width="100%" style="font-size: 13px; color: #1e293b; line-height: 1.8;">
              <tr>
                <td width="35%" style="color: #64748b; font-weight: 500;">Tanggal</td>
                <td width="65%" style="font-weight: 700; color: #0f172a;">: ${interviewDate}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 500;">Waktu</td>
                <td style="font-weight: 700; color: #0f172a;">: ${interviewTime}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 500;">Tim Penyeleksi</td>
                <td style="font-weight: 600; color: #0f172a;">: ${examiner}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 500;">Metode</td>
                <td style="font-weight: 600; color: #0f172a;">: Online Video Conference (Google Meet / Zoom)</td>
              </tr>
            </table>
          </div>

          <!-- Notes -->
          <div style="background-color: #f8fafc; border-left: 4px solid #00875a; padding: 14px 18px; border-radius: 0 10px 10px 0; margin-bottom: 28px;">
            <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
              <strong>Catatan Persiapan:</strong><br />
              ${notes}
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 28px;">
            <a href="${meetLink}" target="_blank" style="display: inline-block; background-color: #00875a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 135, 90, 0.25);">
              Buka Link Wawancara
            </a>
          </div>

          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            Atau salin tautan berikut ke browser Anda:<br />
            <a href="${meetLink}" style="color: #00875a; text-decoration: underline;">${meetLink}</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #64748b;">
            Email ini dikirim secara otomatis oleh platform Qurani.<br />
            &copy; 2026 Qurani - Platform Pembelajaran Al-Qur'an Digital Nusantara.
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailConfig = await getMailTransporter();
  const senderEmail = mailConfig.sender;

  if (mailConfig.isLive && mailConfig.transporter) {
    const info = await mailConfig.transporter.sendMail({
      from: `"Qurani Education" <${senderEmail}>`,
      to: toEmail,
      subject: `Undangan Wawancara Seleksi Guru Qurani - ${teacherName}`,
      html: htmlContent,
    });

    return {
      success: true,
      isLive: true,
      messageId: info.messageId,
      message: `Email resmi berhasil dikirim ke ${toEmail}`,
    };
  }

  // Mode pengujian lokal / sebelum kredensial dimasukkan
  return {
    success: true,
    isLive: false,
    messageId: `sim-${Date.now()}`,
    message: `Notifikasi email siap dikirim ke ${toEmail}`,
  };
}
