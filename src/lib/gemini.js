import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateQuizQuestions = async (context, phase) => {
  const prompt = `
    Kamu adalah AI Pakar Karier untuk Skillio.
    Berdasarkan konteks hasil quiz sebelumnya: "${context}"
    
    Buatlah 10 pertanyaan quiz fase ${phase} untuk membantu menentukan karier yang cocok bagi user Gen Z.
    Fase 2: Pertanyaan mulai mengerucut ke beberapa bidang.
    Fase 3: Pertanyaan sangat spesifik untuk memastikan kecocokan bidang.
    
    Output harus berupa JSON array dengan format:
    [
      {
        "question_text": "...",
        "options": ["A", "B", "C", "D"],
        "correct_option": "..." (hanya untuk fase 3, kalau fase 2 biarkan null)
      }
    ]
    
    Gunakan Bahasa Indonesia yang santai tapi profesional (ala Gen Z Indonesia).
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};
