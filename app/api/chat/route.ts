const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_KEY = process.env.API_KEY || 'secret';

export async function POST(request: Request) {
  try {    
    const data = await request.json();
    const model = data.model || 'gpt-4o';
    const gayaRespons = data.gayaRespons || 'santai';
    const gayaResponsPetunjuk = data.gayaResponsPetunjuk || '';
    
    let petunjukSistem = 'Kamu adalah asisten AI yang membantu pengguna. Berikan jawaban yang sopan, akurat, dan bermanfaat.';
    
    if (gayaResponsPetunjuk) {
      petunjukSistem += ' ' + gayaResponsPetunjuk;
    } else {
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
    ];    
    
    if (data.riwayatPesan && data.riwayatPesan.length === 0) {
      messages.unshift({
        role: 'system',
        content: petunjukSistem
      });
      messages.push({
        role: 'user',
        content: data.pesan
      });
    }
    const streamMode = data.stream !== false;
    
    const konfigurasiAPI = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        messages: messages,
        model: model,
        stream: streamMode
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

    if (streamMode) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      let responsAkumulasi = '';

      const stream = new ReadableStream({
        async start(controller) {
          const reader = respons.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                controller.close();
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');
              
              for (const line of lines) {
                if (line.startsWith('data:')) {
                  const data = line.slice(5).trim();
                  
                  if (data === '[DONE]') {
                    continue;
                  }
                  
                  try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.choices && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                      const content = jsonData.choices[0].delta.content;
                      responsAkumulasi += content;
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        tipe: 'konten',
                        konten: content,
                        kontenPenuh: responsAkumulasi
                      })}\n\n`));
                    }
                  } catch (e) {
                    console.error('Error saat memproses data stream:', e);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error streaming respons:', error);
            controller.error(error);
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
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