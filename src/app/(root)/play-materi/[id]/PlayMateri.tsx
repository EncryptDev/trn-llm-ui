"use client";

import CountDown from "@/components/shared/CountDown";
import { getDetailByMateriId } from "@/lib/server/detailMateri.action";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type DetailMateri = Awaited<ReturnType<typeof getDetailByMateriId>>;

export default function PlayMateri({ details }: { details: DetailMateri }) {
    const [indexMateri, setIndexMateri] = useState(0);
    const [loadingSpeak, setLoadingSpeak] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [done, setDone] = useState(false);
    const router = useRouter();

    const fetchSound = async (index: number) => {
        console.log(details);
        if (details.length === 0 || index >= details.length) return;
        const materi = details[index];


        if (!materi.transcript.trim()) return;

        try {
            setLoadingSpeak(true);
            const params = new URLSearchParams();
            params.append("text", materi.transcript);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ttsx3`, {
                method: "POST",
                cache: "no-store",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: materi.transcript })
            });

            if (!response.ok) throw new Error("Gagal mengenerate suara");
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (error: any) {
            console.error("TTS error:", error.message);
        } finally {
            setLoadingSpeak(false);
        }
    };

    // Fetch first sound on mount
    useEffect(() => {
        fetchSound(indexMateri);
    }, [indexMateri]);

    // Play audio when audioUrl changes
    useEffect(() => {
        if (audioRef.current && audioUrl) {
            audioRef.current.load();
            audioRef.current.play().catch(console.error);
        }
    }, [audioUrl]);

    const handleEnded = () => {
        if (indexMateri + 1 < details.length) {
            setIndexMateri(prev => prev + 1);
        } else {
            setDone(true);
        }
    };

    return (
        <div>
            {details.length === 0 && (
                <p className="text-white">Tidak ada materi</p>
            )};

            {details.length !== 0 && (
                <>
                    {done ? (
                        <>
                            <p className="text-white text-center text-xl">Kita akan memasuki sesi tanya jawab</p>
                            <CountDown time={5} callBack={() => router.push('/chat')} />
                        </>
                    ) : (
                        <>
                            <img
                                className="w-[700px] object-fill rounded-md"
                                alt="img preview"
                                src={`/${details[indexMateri].image}`}
                            />

                            {loadingSpeak && (
                                <div className="flex gap-2 mt-4">
                                    <p className="text-white text-lg">Generating voice...</p>
                                    <Loader2Icon className="animate-spin text-white" />
                                </div>
                            )}

                            {audioUrl && (
                                <div className="mt-10 flex justify-center">
                                    <audio
                                        ref={audioRef}
                                        controls
                                        src={audioUrl}
                                        onEnded={handleEnded}
                                        autoPlay
                                    />
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
