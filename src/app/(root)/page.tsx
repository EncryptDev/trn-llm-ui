import { getAllMateri } from "@/lib/server/materi.action"
import MateriCard from "./MateriCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export const dynamic = "force-dynamic";

export default async function MainPage() {

    const materies = await getAllMateri();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 p-4 pb-24">

            <div className="fixed top-10 right-10">
                <Link href={'/admin'}>
                    <Button className="hover:cursor-pointer">
                        Admin
                    </Button>
                </Link>
            </div>

            <h1 className="text-center text-white font-bold text-3xl">Welcome to Training Self Learning</h1>
            <h2 className="text-center text-white mt-4 font-bold text-lg">Pick one of materi below to start</h2>

            {/* Materi card */}
            <div className="flex flex-wrap gap-6 justify-center mt-12">

                {materies.map(materi => (
                    <MateriCard materi={materi} key={materi.id} />
                ))}

            </div>
        </div>
    )
}