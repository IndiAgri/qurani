import { NextResponse } from "next/server";
import { sendInterviewEmail } from "@/lib/email-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      toEmail,
      teacherName,
      interviewDate,
      interviewTime,
      meetLink,
      examiner,
      notes,
    } = body;

    if (!toEmail) {
      return NextResponse.json(
        { success: false, message: "Alamat email tujuan (toEmail) wajib diisi." },
        { status: 400 }
      );
    }

    const result = await sendInterviewEmail({
      toEmail,
      teacherName: teacherName || "Calon Pengajar",
      interviewDate,
      interviewTime,
      meetLink,
      examiner,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: `Email undangan wawancara berhasil dikirim ke ${toEmail}`,
      data: result,
    });
  } catch (error: any) {
    console.error("Error sending interview email:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Gagal mengirim email undangan wawancara.",
      },
      { status: 500 }
    );
  }
}
