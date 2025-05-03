import { getDetailByMateriId } from "@/lib/server/detailMateri.action"
import PlayMateri from "./PlayMateri";

export default async function PlayMateriPage({params}:{params:Promise<{id:string}>}){
   const {id} = await params;

    const details = await getDetailByMateriId(id);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 p-4 pb-24">
            <PlayMateri details={details} />
        </div>
    )
}