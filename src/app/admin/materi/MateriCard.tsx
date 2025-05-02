"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getAllMateri } from "@/lib/server/materi.action"
import { useMateriIdState } from "@/store/materId"
import { PenBoxIcon, Trash2 } from "lucide-react"

type Materis = Awaited<ReturnType<typeof getAllMateri>>
type Materi = Materis[number]


export default function MateriCard({ materi }: { materi: Materi }) {

    const setId = useMateriIdState((state) => state.setId);

    return (
        <Card className="w-full min-w-80 col-span-4" key={`materi-${materi.id}`}>

            <CardContent>
                <h1 className="font-bold text-xl">Materi {materi.title}</h1>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
                <Button onClick={() => setId(materi.id)} className="bg-amber-500 hover:bg-amber-600"><PenBoxIcon /></Button>
                <Button variant={"destructive"}><Trash2 /></Button>
            </CardFooter>
        </Card>
    )
}