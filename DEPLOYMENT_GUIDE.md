# VoiceVerify API Deployment Guide

## Environment Variables Setup

### 1. Local Development (.env.local)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Vercel Production Environment
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key_here`
   - Environment: Production, Preview, Development

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables (if not done via dashboard)
```bash
vercel env add GEMINI_API_KEY
```

## API Endpoint Testing

### Sample cURL Request
```bash
curl -X POST https://your-project.vercel.app/api/voice-detect \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_gemini_api_key_here" \
  -d '{
    "Language": "Tamil",
    "Audio Format": "audio/wav",
    "Audio Base64 Format": "UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
  }'
```

### Expected Response Format
```json
{
  "prediction": "AI_GENERATED",
  "confidence": 0.93,
  "language": "Tamil"
}
```

### Postman Test
1. Method: POST
2. URL: `https://your-project.vercel.app/api/voice-detect`
3. Headers: 
   - `Content-Type: application/json`
   - `x-api-key: your_gemini_api_key_here`
4. Body (raw JSON):
```json
{
  "Language": "English",
  "Audio Format": "audio/wav",
  "Audio Base64 Format": "UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
}
```

## Supported Languages
- Tamil
- English
- Hindi
- Malayalam
- Telugu

## Error Handling
The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (missing/invalid parameters)
- 405: Method Not Allowed (non-POST requests)
- 500: Internal Server Error

## API Authentication
The API requires authentication via the `x-api-key` header. Use your Gemini API key as the value.

## Request Format
The API expects a JSON body with these exact field names:
- `Language`: The expected language (e.g., "Tamil", "English", "Hindi")
- `Audio Format`: MIME type of the audio (e.g., "audio/wav", "audio/mp3")
- `Audio Base64 Format`: Base64 encoded audio data

## Deployment Checklist
- [ ] Environment variables set in Vercel
- [ ] API endpoint responds to POST requests
- [ ] Returns valid JSON in required format
- [ ] Handles base64 audio data correctly
- [ ] API key authentication working
- [ ] Multi-language support working
- [ ] Error handling implemented
- [ ] CORS headers configured
- [ ] API is publicly accessible

## Final Submission URL
After deployment, submit this URL to the hackathon:
```
https://your-project.vercel.app/api/voice-detect
```