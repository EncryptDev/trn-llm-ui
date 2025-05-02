
"use client";

import DetailMateriForm from "@/components/form/DetailMateriForm";
import { getDetailByMateriId } from "@/lib/server/detailMateri.action"
import { useMateriIdState } from "@/store/materId";
import { FormDetailMateriEntries } from "@/types/form";
import { useEffect, useState } from "react";


type DetailMateri = Awaited<ReturnType<typeof getDetailByMateriId>>;

export default function EditMateri() {

    const [details, setDetails] = useState<DetailMateri>([]);

    const materiId = useMateriIdState(state => state.id);

    // const detailsMateri = await getDetailByMateriId(materiId);

    useEffect(() => {
        const getData = async () => {
            const res = await getDetailByMateriId(materiId);
            setDetails(res);
        }
        getData();
    }, [materiId])

    const formField: FormDetailMateriEntries[] = details.map(item => {
        return {
            transcript: item.transcript,
            file: item.image
        }
    });

    const onSubmit = async (data: { details: FormDetailMateriEntries[] }) => {

    }


    return (
        <>
            {details.length > 0 ? (
                <DetailMateriForm initialDetails={formField} onSubmit={onSubmit} />
            ) : (
                <p className="text-center">Tidak Ada Data</p>
            )}
        </>
    )
}