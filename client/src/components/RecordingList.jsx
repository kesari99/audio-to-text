import React from "react";
import axios from "axios";


export default function RecordingList({ recordings, onSetTTS }) {
  const uploadToAssembly = async (blob) => {
    const uploadResp = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      blob,
      {
        headers: {
          'Authorization': import.meta.env.VITE_ASSEMBLY_API_KEY,
          'Content-Type': 'application/octet-stream'
        }
      }
    );
    return uploadResp.data.upload_url;
  };

  const transcribeWithAssembly = async (rec) => {
    const blob = await fetch(rec.url).then(res => res.blob());
    const uploadUrl = await uploadToAssembly(blob);

    const resp = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      {
        audio_url: uploadUrl,
        speech_model: 'universal',
        summarization: true,
        summary_model: 'informative',
        summary_type: 'bullets'
      },
      { headers: { Authorization: import.meta.env.VITE_ASSEMBLY_API_KEY } }
    );

    const id = resp.data.id;
    while (true) {
      const statusResp = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${id}`,
        { headers: { Authorization: import.meta.env.VITE_ASSEMBLY_API_KEY } }
      );
      const status = statusResp.data.status;
      if (status === "completed") {
        alert("Transcript: " + statusResp.data.text);
        return;
      }
      if (status === "error") {
        alert("Error transcribing with AssemblyAI");
        return;
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
  };

  if (!recordings.length)
    return (
      <p className="text-center text-gray-500 mt-8">
        No recordings yet. Click “Start Recording” above.
      </p>
    );

  return (
    <div className="space-y-8 mt-6">
      {recordings.map((rec) => (
        <div
          key={rec.id}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
        >
          <h2 className="text-xl font-semibold">
            {new Date(rec.id).toLocaleString()}
          </h2>

          <audio controls src={rec.url} className="w-full" />

          {rec.transcript && (
            <div>
              <h3 className="font-medium mb-1">Transcript:</h3>
              <p className="whitespace-pre-line bg-gray-50 p-4 rounded">
                {rec.transcript}
              </p>
            </div>
          )}

          {rec.summary && (
            <div>
              <h3 className="font-medium mb-1">Summary:</h3>
              <p className="whitespace-pre-line bg-gray-100 p-4 rounded">
                {rec.summary}
              </p>
            </div>
          )}

          <button
            onClick={() => transcribeWithAssembly(rec)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Transcribe with AssemblyAI
          </button>
        </div>
      ))}
    </div>
  );
}
