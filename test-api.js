// Simple test script for the VoiceVerify API
// Run with: node test-api.js

const API_URL = 'http://localhost:3000/api/voice-detect'; // Change to your Vercel URL when deployed
const API_KEY = 'your_gemini_api_key_here'; // Replace with your actual API key

// Sample base64 audio data (very short WAV file)
const sampleAudioBase64 = 'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';

const testData = {
  "Language": "English",
  "Audio Format": "audio/wav",
  "Audio Base64 Format": sampleAudioBase64
};

async function testAPI() {
  try {
    console.log('Testing VoiceVerify API...');
    console.log('Request body keys:', Object.keys(testData));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Status:', response.status);
    
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
    // Validate response format
    if (result.prediction && result.confidence !== undefined && result.language) {
      console.log('✅ API response format is correct!');
      console.log(`Prediction: ${result.prediction}`);
      console.log(`Confidence: ${result.confidence}`);
      console.log(`Language: ${result.language}`);
    } else {
      console.log('❌ API response format is incorrect');
      console.log('Expected: prediction, confidence, language');
      console.log('Received:', Object.keys(result));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();