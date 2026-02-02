import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';

interface APIRequest {
  Language: string;
  'Audio Format': string;
  'Audio Base64 Format': string;
}

interface APIResponse {
  prediction: 'AI_GENERATED' | 'HUMAN' | 'UNCERTAIN';
  confidence: number;
  language: string;
}

interface GeminiResult {
  label: 'AI' | 'Human' | 'Uncertain';
  confidence: number;
  explanation: string;
  reasoningPoints: string[];
  detectedLanguage?: string;
}

// Main API handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  
  try {
    // Validate API key from headers
    const apiKeyFromHeader = req.headers['x-api-key'];
    const expectedApiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKeyFromHeader) {
      return res.status(401).json({ error: 'Missing x-api-key header' });
    }
    
    if (!expectedApiKey) {
      console.error('GEMINI_API_KEY environment variable not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // For hackathon purposes, we'll accept any API key that matches our Gemini key
    // In production, you'd want separate API key management
    if (apiKeyFromHeader !== expectedApiKey) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    // Validate request body
    const { Language, 'Audio Format': audioFormat, 'Audio Base64 Format': audioBase64 }: APIRequest = req.body;
    
    if (!Language || typeof Language !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid Language parameter' });
    }
    
    if (!audioFormat || typeof audioFormat !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid Audio Format parameter' });
    }
    
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid Audio Base64 Format parameter' });
    }
    
    // Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey: expectedApiKey });
    
    // Prepare audio part for Gemini
    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType: audioFormat,
      },
    };
    
    // Create analysis prompt with language context
    const prompt = `
      You are an expert audio analyst specializing in detecting AI-generated speech across multiple languages including Tamil, English, Hindi, Malayalam, and Telugu.
      
      Analyze the provided audio file and determine if it is human or AI-generated speech.
      The expected language is: ${Language}
      
      Look for these indicators:
      1. Spectral artifacts or metallic reverberations common in TTS models
      2. Unnatural prosody patterns or robotic rhythm
      3. Consistent background noise floors that don't fluctuate naturally
      4. Subtle glitches at phoneme boundaries
      5. Language-specific pronunciation anomalies
      6. Breathing patterns and natural speech variations
      
      Classify as 'AI', 'Human', or 'Uncertain'.
      Provide confidence score between 0.0 and 1.0.
      Identify the actual language being spoken.
      
      Response must be in the specified JSON format.
    `;
    
    // Call Gemini API
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: { parts: [{ text: prompt }, audioPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: {
              type: Type.STRING,
              enum: ['AI', 'Human', 'Uncertain'],
              description: 'The classification label.',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score (0.0 to 1.0).',
            },
            explanation: {
              type: Type.STRING,
              description: 'Summary of the finding.',
            },
            reasoningPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific acoustic clues discovered.',
            },
            detectedLanguage: {
              type: Type.STRING,
              description: 'Primary language detected.',
            },
          },
          required: ['label', 'confidence', 'explanation', 'reasoningPoints'],
        },
      },
    });
    
    // Parse Gemini response
    const text = response.text;
    if (!text) {
      throw new Error('No analysis text returned from Gemini model');
    }
    
    const geminiResult: GeminiResult = JSON.parse(text.trim());
    
    // Transform to required API format
    const prediction = geminiResult.label === 'AI' ? 'AI_GENERATED' : 
                     geminiResult.label === 'Human' ? 'HUMAN' : 'UNCERTAIN';
    
    const apiResponse: APIResponse = {
      prediction,
      confidence: Math.round(geminiResult.confidence * 100) / 100, // Round to 2 decimal places
      language: geminiResult.detectedLanguage || Language
    };
    
    return res.status(200).json(apiResponse);
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Return structured error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({ 
      error: 'Analysis failed',
      details: errorMessage
    });
  }
}