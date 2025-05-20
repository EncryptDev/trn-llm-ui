"use client";

import VoiceRecorder from "@/components/shared/VoiceRecorder"
import { Loader2Icon, Mic, Send } from "lucide-react"
import Image from "next/image"
import ChatBox from "./ChatBox"
import { useEffect, useRef, useState } from "react"
import { ChatState } from "@/types/state"
import Link from "next/link";
import OfflineVoiceRecorder from "@/components/shared/OfflineVoiceRecorder";


function page() {

  const [messages, setMessages] = useState<ChatState[]>([]);
  const abortController = useRef<AbortController>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loadingSpeak, setLoadingSpeak] = useState(false);




  const handleSend = async (q?: string) => {
    const queryToUse = q ?? query;
    if (!queryToUse.trim()) return;

    const userMessage = { role: "user", content: queryToUse };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    if (abortController.current) {
      abortController.current.abort(); // Batalkan request sebelumnya jika ada
    }

    abortController.current = new AbortController(); // Buat controller baru
    const signal = abortController.current.signal;

    try {
      const response = await fetch(`http://127.0.0.1:8000/chat_stream/?query=${queryToUse}`, { signal });
      const reader = response!.body!.getReader();
      const decoder = new TextDecoder();
      let botMessage = { role: "bot", content: "" };
      setMessages((prev) => [...prev, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        botMessage.content += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...botMessage };
          return newMessages;
        });
      }


    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Fetch error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSound = async (text: string) => {
    try {

    } catch (error) {
      console.error("TTS error:", error);
    } finally {
      setLoadingSpeak(false);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ttsx3`, {
        method: "POST",
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error("Gagal mengenerate suara");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

    }
  }
  // Play audio when audioUrl changes
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
  }, [audioUrl]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;

      // Hentikan pembacaan yang sedang berlangsung
      synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set bahasa Indonesia
      utterance.lang = 'id-ID';

      // Atur kecepatan dan pitch
      utterance.rate = 1;
      utterance.pitch = 1;

      // utterance.onstart = () => setIsSpeaking(true);
      // utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Error terjadi:', event);
        // setIsSpeaking(false);
      };

      synthesis.speak(utterance);
    } else {
      alert('Text-to-Speech tidak didukung di browser Anda');
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    // setIsSpeaking(false);
  };

  useEffect(() => {
    if (loading === false) {
      if (messages.length > 0) {
        const text = messages[messages.length - 1].content;
        fetchSound(text);
      }
    }
  }, [loading])


  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-800 p-4 pb-24">
      {/* Admin Button */}
      <div className="fixed top-4 right-4">
        <Link href={"/"}>
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700">Main Menu</button>
        </Link>
      </div>
      {/* Welcome message  */}
      {messages.length > 0 ? (<ChatBox loading={loading} messages={messages} />) :
        (
          <div className="flex-grow flex flex-col justify-center items-center">
            <Image src={"/maskot.png"} alt="Logo" width={120} height={120} className="mb-5" />
            <div className="text-center">
              <h1 className="text-3xl text-white">Hi saya adit trainer PT Surabaya Autocomp Indonesia</h1>
              <p className="text-lg text-gray-400">Saya siap menjawab pertanyaan anda</p>
            </div>
          </div>
        )}

      {/* Play audio */}
      {audioUrl && (
        <div className="hidden">
          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            // onEnded={handleEnded}
            autoPlay
          />
        </div>
      )}

      {/* Text Input */}
      <div className="fixed bottom-10  px-4 ">
        <div className="flex gap-4">
          <input
            className="p-4 w-[750px] max-w-2xl border border-gray-500 rounded-xl bg-gray-800 text-white"
            type="text"
            placeholder="Masukkan pertanyaan ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <OfflineVoiceRecorder callBack={(val) => {
            setQuery(val);
            setTimeout(() => {
              console.log("dijalankan");
              handleSend(val);
            }, 500)
          }} />
          <button disabled={loading} className={` p-4 rounded-xl ${loading ? 'bg-gray-300' : 'bg-white'}`} onClick={() => handleSend()}>
            {loading ? (
              <Loader2Icon className="text-black animate-spin" />
            ) : (
              <Send className=" text-black" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default page
