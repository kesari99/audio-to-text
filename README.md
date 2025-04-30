# Audio Transcription App

A React-based application that uses AssemblyAI to record, transcribe, and summarize spoken audio.

![App Screenshot](https://github.com/user-attachments/assets/92a5a989-7ef4-4875-8b17-9021197e4e82)

## Features

- **Audio Recording**: Record audio directly from your browser
- **Real-time Processing**: Auto-transcription after recording
- **Dual-card Interface**: Separate cards for recordings and transcriptions
- **Text Summaries**: AI-powered summaries of longer recordings
- **Media Playback**: Review your audio recordings in-app

## Project Structure

```
audio-transcription-app/
├── client/                  # React frontend
│   ├── public/              # Static files
│   └── src/                 # React components & logic
│       ├── components/      # React components
│       │   ├── AudioRecorder.jsx
│       │   └── TranscriptionList.jsx
│       ├── App.jsx          # Main application component
│       └── index.js         # Entry point
├── package.json             # Project dependencies
└── README.md                # This file
```

## Technologies Used

- **React**: Frontend framework
- **AssemblyAI API**: Speech-to-text transcription
- **MediaRecorder API**: Browser audio recording
- **Tailwind CSS**: Styling

## AssemblyAI APIs Used

This application leverages the following AssemblyAI endpoints:

1. **Upload API**
   - Endpoint: `https://api.assemblyai.com/v2/upload`
   - Method: `POST`
   - Purpose: Upload audio files for processing
   - Headers:
     - `Authorization`: Your AssemblyAI API key
     - `Content-Type`: `application/octet-stream`

2. **Transcription API**
   - Endpoint: `https://api.assemblyai.com/v2/transcript`
   - Method: `POST`
   - Purpose: Request audio transcription with optional features
   - Headers:
     - `Authorization`: Your AssemblyAI API key
     - `Content-Type`: `application/json`
   - Parameters:
     - `audio_url`: URL of the uploaded audio
     - `speech_model`: "universal" (better for diverse accents/languages)
     - `summarization`: Boolean to enable summary generation
     - `summary_type`: "bullets" for bullet-point summaries
     - `summary_model`: "informative" for detailed summaries

3. **Transcript Status API**
   - Endpoint: `https://api.assemblyai.com/v2/transcript/{transcript_id}`
   - Method: `GET`
   - Purpose: Check transcription status and retrieve results
   - Headers:
     - `Authorization`: Your AssemblyAI API key

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AssemblyAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/kesari99/audio-to-text.git
   
   ```

2. Install dependencies:
   ```
   cd client
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   VITE_ASSEMBLY_API_KEY=your_assemblyai_api_key
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:5137](http://localhost:5137) in your browser

## Usage

1. Click "Start Recording" to begin capturing audio from your microphone
2. Speak clearly into your microphone
3. Click "Stop Recording" when finished
4. The application will automatically:
   - Save the recording to the Audio Recordings card
   - Upload the audio to AssemblyAI
   - Process the transcription
   - Display the transcribed text in the Transcriptions card
   - Generate and display a summary (for longer recordings)


## Security Notes

- Never expose your AssemblyAI API key in client-side code in production
- In a production environment, implement a server-side proxy to make API calls
- Consider implementing rate limiting to avoid excessive API usage



## Acknowledgments

- [AssemblyAI](https://www.assemblyai.com/) for their powerful speech-to-text API
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
