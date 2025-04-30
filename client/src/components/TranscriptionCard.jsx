import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function TranscriptionCard({ recordings }) {
    
  // Filter recordings to only show ones with transcripts
  const transcribedRecordings = recordings.filter(rec => rec.transcript);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
      <FaCheckCircle className="mr-2 w-5 h-5 text-green-600" />

        Transcriptions
      </h2>
      
      {transcribedRecordings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transcriptions available yet.</p>
      ) : (
        <div className="space-y-6">
          {transcribedRecordings.map(rec => (
            <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-3">
                {new Date(parseInt(rec.id)).toLocaleString()}
              </p>
              
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Transcript:</h3>
                <p className="bg-gray-50 p-3 rounded text-gray-800">
                  {rec.transcript}
                </p>
              </div>
              
              {rec.summary && (
                <div>
                  <h3 className="text-md font-medium mb-2">Summary:</h3>
                  <div className="bg-blue-50 p-3 rounded text-gray-800">
                    {rec.summary.split('-').filter(item => item.trim()).map((point, idx) => (
                      <p key={idx} className="mb-1">• {point.trim()}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}