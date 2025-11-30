
export async function askGemini(question: string, context: string, apiKey: string) {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  // Simpler, more direct prompt
  const prompt = `Basierend auf folgendem Text:\n\n${context.substring(0, 20000)}\n\nBeantworte auf Deutsch: ${question}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log('Calling Gemini API...');
    console.log('Question:', question);
    console.log('Context length:', context.length);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      throw new Error(errorData.error?.message || `API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // Check if response was blocked by safety filters
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Antwort wurde blockiert: ${data.promptFeedback.blockReason}`);
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Keine Antwort von der KI erhalten");
    }
    
    const candidate = data.candidates[0];
    
    // Check if the candidate was blocked
    if (candidate.finishReason === 'SAFETY') {
      throw new Error("Antwort wurde aus Sicherheitsgründen blockiert");
    }
    
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error("Leere Antwort von der KI");
    }
    
    const text = candidate.content.parts[0].text;
    
    if (!text || text.trim().length === 0) {
      throw new Error("KI hat eine leere Antwort zurückgegeben");
    }
    
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`KI-Fehler: ${error.message || 'Unbekannter Fehler'}`);
  }
}
