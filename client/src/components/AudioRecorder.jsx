import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaMicrophone, FaSquare } from 'react-icons/fa';

export default function AudioRecorder({ onRecordingComplete, onTranscriptionComplete }) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);


  const uploadToAssembly = async (blob) => {
    try {
      const uploadResp = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        blob,
        {
          headers: {
            'Authorization':import.meta.env.VITE_ASSEMBLY_API_KEY,
            'Content-Type': 'application/octet-stream'
          }
        }
      );
      return uploadResp.data.upload_url;
    } catch (err) {
      setError("Upload error: " + err.message);
      return null;
    }
  };

  const transcribe = async (audioUrl, recordingId) => {
    try {
      setTranscribing(true);
      const transcriptResp = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        { 
          audio_url: audioUrl, 
          speech_model: 'universal',
          summarization: true,
          summary_type: 'bullets',
          summary_model: 'informative'
        },
        { headers: { 'Authorization': import.meta.env.VITE_ASSEMBLY_API_KEY } }
      );
      
      const id = transcriptResp.data.id;
      
      while (true) {
        const statusResp = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${id}`,
          { headers: { 'Authorization': import.meta.env.VITE_ASSEMBLY_API_KEY } }
        );
        
        const status = statusResp.data.status;
        
        if (status === 'completed') {
          setTranscribing(false);
          onTranscriptionComplete(recordingId, statusResp.data.text, statusResp.data.summary);
          return;
        }
        
        if (status === 'error') {
          setTranscribing(false);
          throw new Error('Transcription error');
        }
        
        await new Promise(r => setTimeout(r, 3000));
      }
    } catch (err) {
      setTranscribing(false);
      setError("Transcription error: " + err.message);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      recordedChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => { 
        if (e.data.size) recordedChunksRef.current.push(e.data); 
      };
      
      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const id = Date.now().toString();
        
        const newRecording = { id, url, blob };
        onRecordingComplete(newRecording);
        
        const uploadUrl = await uploadToAssembly(blob);
        if (uploadUrl) {
          await transcribe(uploadUrl, id);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      setError("Couldn't access microphone: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex justify-center mb-6">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={transcribing}
          className={`flex items-center px-6 py-3 rounded-lg text-white transition ${
            recording
              ? 'bg-red-600 hover:bg-red-700'
              : transcribing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {recording ? (
            <>
                   <FaSquare className="mr-2 w-4 h-4" />

              Stop Recording
            </>
          ) : transcribing ? (
            <>
              <div className="mr-2 animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </>
          ) : (
            <>
             <FaMicrophone className="mr-2 w-4 h-4" />

              Start Recording
            </>
          )}
        </button>
      </div>
    </div>
  );
}