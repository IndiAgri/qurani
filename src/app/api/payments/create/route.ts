import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, teacherName, type, customerName, customerEmail } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Nominal pembayaran tidak valid' }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    const orderId = `INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!serverKey) {
      return NextResponse.json({
        error: 'MIDTRANS_SERVER_KEY belum diatur. Silakan atur di .env.local dari dashboard Midtrans Sandbox.'
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
      },
      item_details: [
        {
          id: 'COURSE-BOOKING',
          price: Math.round(Number(amount)),
          quantity: 1,
          name: `${teacherName || 'Bimbingan'} - ${type || 'Paket Belajar'}`.slice(0, 50),
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

    const data = await midtransRes.json();

    if (!midtransRes.ok) {
      const errorMsg = Array.isArray(data.error_messages)
        ? data.error_messages.join(', ')
        : (data.message || 'Gagal membuat transaksi Midtrans');
      return NextResponse.json({ error: errorMsg }, { status: midtransRes.status });
    }

    return NextResponse.json({
      token: data.token,
      redirect_url: data.redirect_url,
      orderId,
    });
  } catch (error: any) {
    console.error('Midtrans Payment Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan server' }, { status: 500 });
  }
}
