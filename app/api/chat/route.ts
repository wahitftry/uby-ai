const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_KEY = process.env.API_KEY || 'secret';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const messages = data.riwayatPesan || [
      {
        role: 'system',
        content: 'Kamu adalah asisten AI yang membantu pengguna. Berikan jawaban yang sopan, akurat, dan bermanfaat.'
      },
      {
        role: 'user',
        content: data.pesan
      }
    ];
    if (data.riwayatPesan && data.riwayatPesan.length === 0) {
      messages.unshift({
        role: 'system',
        content: 'Kamu adalah asisten AI yang membantu pengguna. Berikan jawaban yang sopan, akurat, dan bermanfaat.'
      });
      messages.push({
        role: 'user',
        content: data.pesan
      });
    }
    const konfigurasiAPI = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        messages: messages,
        model: 'gpt-4o',
        stream: false
      })
    };
    
    const respons = await fetch(`${API_URL}/v1/chat/completions`, konfigurasiAPI);
    
    if (!respons.ok) {
      return Response.json({
        respons: `Error: ${respons.status}`,
        status: 'error',
        kode: respons.status
      }, { status: respons.status });
    }
    
    const responsData = await respons.json();
    
    return Response.json({
      respons: responsData.choices?.[0]?.message?.content || 'Tidak ada respons dari AI',
      status: 'success',
      kode: respons.status
    });
  } catch (error) {
    console.error('Error mengirim pesan ke API eksternal:', error);
    return Response.json({
      respons: 'Terjadi kesalahan saat berkomunikasi dengan AI. Silakan coba lagi.',
      status: 'error', 
      kode: 500
    }, { status: 500 });
  }
}