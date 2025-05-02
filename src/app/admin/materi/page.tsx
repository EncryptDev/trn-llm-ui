import { Button } from "@/components/ui/button";
import { getAllMateri } from "@/lib/server/materi.action"
import {  PlusCircle } from "lucide-react";
import Link from "next/link";
import MateriCard from "./MateriCard";
import EditMateri from "./EditMateri";

export default async function MateriPage() {

    const materies = await getAllMateri();

    return (
        <div className="px-12 py-12">

            {/* Tampilan Card Materi */}

            <h1 className="text-2xl font-bold">List Materi AI</h1>
            <Link href={'/admin/materi/create'}>
                <Button className="mt-3"><PlusCircle />Tambah Data</Button>
            </Link>

            <div className="grid grid-cols-12  mt-10 gap-3 mb-12">
                {materies.map(materi => (
                    <MateriCard materi={materi} key={materi.id}/>
                ))}

            </div>

            {/* Edit component */}
            <EditMateri />


        </div>
    )
}