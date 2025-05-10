const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_KEY = process.env.API_KEY || 'secret';

export async function POST(request: Request) {
  try {    const data = await request.json();
    const model = data.model || 'gpt-4o';
    const gayaRespons = data.gayaRespons || 'santai';
    
    let petunjukSistem = 'Kamu adalah asisten AI yang membantu pengguna. Berikan jawaban yang sopan, akurat, dan bermanfaat.';
    
    switch(gayaRespons) {
      case 'formal':
        petunjukSistem += ' Gunakan bahasa formal dan profesional. Hindari bahasa gaul atau ekspresi informal.';
        break;
      case 'santai':
        petunjukSistem += ' Gunakan bahasa yang santai dan ramah, seperti berbicara dengan teman. Boleh menggunakan bahasa percakapan sehari-hari.';
        break;
      case 'panjang':
        petunjukSistem += ' Berikan jawaban yang detail, menyeluruh dan mendalam. Jelaskan dengan contoh jika perlu.';
        break;
      case 'pendek':
        petunjukSistem += ' Berikan jawaban yang singkat, padat dan jelas. Langsung ke poin utama tanpa elaborasi yang berlebihan.';
        break;
    }
    
    const messages = data.riwayatPesan || [
      {
        role: 'system',
        content: petunjukSistem
      },
      {
        role: 'user',
        content: data.pesan
      }
    ];    if (data.riwayatPesan && data.riwayatPesan.length === 0) {
      messages.unshift({
        role: 'system',
        content: petunjukSistem
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
        model: model,
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
      kode: respons.status,
      modelDipakai: model
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