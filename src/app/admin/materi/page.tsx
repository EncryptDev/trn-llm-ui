import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getAllMateri } from "@/lib/server/materi.action"
import { PenBoxIcon, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function MateriPage() {

    const materies = await getAllMateri();

    return (
        <div className="px-12 py-12">

            {/* Tampilan Card Materi */}

            <h1 className="text-2xl font-bold">List Materi AI</h1>
            <Link href={'/admin/materi/create'}>
            <Button className="mt-3"><PlusCircle/>Tambah Data</Button>
            </Link>

            <div className="grid grid-cols-12  mt-10 gap-3">
                {materies.map(materi => (
                    <Card className="w-full min-w-80 col-span-4" key={`materi-${materi.id}`}>

                        <CardContent>
                            <h1 className="font-bold text-xl">Materi {materi.title}</h1>
                        </CardContent>
                        <CardFooter className="flex gap-2 justify-end">
                            <Button className="bg-amber-500 hover:bg-amber-600"><PenBoxIcon /></Button>
                            <Button variant={"destructive"}><Trash2 /></Button>
                        </CardFooter>
                    </Card>
                ))}

            </div>


        </div>
    )
}