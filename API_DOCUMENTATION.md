# 🎤 VoiceVerify API Documentation

## Endpoint Information

**Base URL**: `https://voiceverify1.vercel.app/api/voice-detection`

**Method**: `POST`

**Content-Type**: `application/json`

## Authentication

**Header**: `x-api-key`
**Value**: Your API key (provided during hackathon submission)

## Request Format

```json
{
  "language": "string",
  "audioFormat": "string", 
  "audioBase64Format": "string"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | string | Yes | Language of the audio (e.g., "english", "hindi", "tamil") |
| `audioFormat` | string | Yes | Audio file format (e.g., "mp3", "wav", "m4a") |
| `audioBase64Format` | string | Yes | Base64 encoded audio data |

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "classification": "human|ai",
    "confidence": 85,
    "reasoning": [
      "Spectro-temporal analysis completed",
      "Prosodic pattern evaluation performed", 
      "Artifact detection scan finished"
    ],
    "analysis": "Detailed analysis explanation",
    "metadata": {
      "language": "english",
      "format": "mp3",
      "processingTime": 1250,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Voice analysis completed successfully"
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Invalid API key"
}
```

#### 400 Bad Request
```json
{
  "error": "Missing required fields: language, audioFormat, audioBase64Format"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

## Example Usage

### cURL Example
```bash
curl -X POST https://voiceverify1.vercel.app/api/voice-detection \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "language": "english",
    "audioFormat": "mp3",
    "audioBase64Format": "UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
  }'
```

### JavaScript Example
```javascript
const response = await fetch('https://voiceverify1.vercel.app/api/voice-detection', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    language: 'english',
    audioFormat: 'mp3', 
    audioBase64Format: 'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
  })
});

const result = await response.json();
console.log(result);
```

## Rate Limits

- 100 requests per minute per API key
- Maximum audio file size: 10MB
- Maximum audio duration: 5 minutes

## Supported Audio Formats

- MP3
- WAV  
- M4A
- FLAC
- OGG

## Supported Languages

- English
- Hindi
- Tamil
- Malayalam
- Telugu
- Spanish
- French
- German
- Chinese
- Japanese