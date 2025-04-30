import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

export default function RecordingCard({ recordings }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
      <FaMicrophone className="mr-2 w-5 h-5 text-blue-600" />

        Audio Recordings
      </h2>
      
      {recordings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recordings yet. Click "Start Recording" above.</p>
      ) : (
        <div className="space-y-4">
          {recordings.map(rec => (
            <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(parseInt(rec.id)).toLocaleString()}
              </p>
              <audio controls src={rec.url} className="w-full mb-2" />
              <div className="flex items-center">
                <div className="mr-2">
                  {rec.transcript ? (
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M6,10 L9,13 L14,7" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  ) : (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  )}
                </div>
                <p className="text-sm">
                  {rec.transcript ? "Transcription complete" : "Transcribing..."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}