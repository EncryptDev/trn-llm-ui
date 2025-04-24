'use client';

import { Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function VoiceRecorder({callBack}: {callBack?: (val:string) => void}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Inisialisasi SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition API tidak didukung di browser ini');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'id-ID'; // Bahasa Indonesia

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      if(callBack){
        callBack(transcript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Error terjadi dalam pengenalan suara:', event.error);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      className={`p-4 rounded-xl ${isRecording ? 'bg-red-500' : 'bg-white'}`}
      aria-label="Record voice"
    >
      <Mic className={`size-5 ${isRecording ? 'text-white' : 'text-black'}`} />
    </button>
  );
}