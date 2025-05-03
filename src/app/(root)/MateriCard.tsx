import { getAllMateri } from "@/lib/server/materi.action";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

type Materies = Awaited<ReturnType<typeof getAllMateri>>
type Materi = Materies[number]



export default function MateriCard({ materi }: { materi: Materi }) {
    return (

        <div className="w-[250px] px-6 py-4 border border-white rounded-xl shadow-lg hover:scale-105">

            <Link href={`/play-materi/${materi.id}`} className="flex gap-2">
                <h1 className="text-white font-semibold text-lg">Materi {materi.title}</h1>
                <ArrowBigRight className="text-white" />
            </Link>


        </div>
    )
}