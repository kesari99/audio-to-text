import React, { useState } from 'react';
import TranscriptionCard from './components/TranscriptionCard';
import RecordingCard from './components/RecordingCard';
import AudioRecorder from './components/AudioRecorder';

export default function App() {
  const [recordings, setRecordings] = useState([]);

  const handleRecordingComplete = (recordingData) => {
    setRecordings(prevRecordings => [recordingData, ...prevRecordings]);
  };

  const updateRecordingWithTranscript = (id, transcript, summary) => {
    setRecordings(prevRecordings => 
      prevRecordings.map(rec => 
        rec.id === id 
          ? { ...rec, transcript, summary }
          : rec
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Audio Transcription App</h1>
      
      <AudioRecorder
        onRecordingComplete={handleRecordingComplete} 
        onTranscriptionComplete={updateRecordingWithTranscript}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RecordingCard recordings={recordings} />
        <TranscriptionCard recordings={recordings} />
      </div>
    </div>
  );
}