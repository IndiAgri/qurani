import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Format JSON request tidak valid' }, { status: 400 });
    }
    const { amount, customerName, customerEmail, userId, phone } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Nominal top up tidak valid' }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    // Order ID format matching Qurani: WLT-TU-{timestamp}-{random}
    const orderId = `WLT-TU-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!serverKey || !serverKey.trim()) {
      console.warn("MIDTRANS_SERVER_KEY belum di-set di .env.local!");
      return NextResponse.json({
        error: 'MIDTRANS_SERVER_KEY belum diatur. Silakan salin Server Key dari dashboard Midtrans Sandbox (Settings -> Access Keys) ke file .env.local'
      }, { status: 500 });
    }

    const authHeader = 'Basic ' + Buffer.from(serverKey.trim() + ':').toString('base64');

    const snapPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(Number(amount)),
      },
      customer_details: {
        first_name: customerName || 'User',
        email: customerEmail || 'user@example.com',
        phone: phone || '081234567890',
      },
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: 'TOPUP-SALDO',
          price: Math.round(Number(amount)),
          quantity: 1,
          name: `Top Up Saldo Qurani - Rp ${Number(amount).toLocaleString('id-ID')}`,
        },
      ],
    };

    const midtransRes = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(snapPayload),
    });

    const rawText = await midtransRes.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('Midtrans returned non-JSON:', rawText);
      return NextResponse.json({ error: `Respon Midtrans (${midtransRes.status}): ${rawText}` }, { status: midtransRes.status });
    }

    if (!midtransRes.ok) {
      const errorMsg = Array.isArray(data.error_messages)
        ? data.error_messages.join(', ')
        : (data.message || data.error || 'Gagal membuat transaksi Midtrans');
      return NextResponse.json({ error: errorMsg }, { status: midtransRes.status });
    }

    return NextResponse.json({
      token: data.token,
      redirect_url: data.redirect_url,
      orderId,
    });
  } catch (error: any) {
    console.error('Midtrans Topup Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan server' }, { status: 500 });
  }
}
