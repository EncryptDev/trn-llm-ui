
"use client";

import DetailMateriForm from "@/components/form/DetailMateriForm";
import { getDetailByMateriId } from "@/lib/server/detailMateri.action"
import { useMateriIdState } from "@/store/materId";
import { FormDetailMateriEntries } from "@/types/form";
import { useEffect, useState } from "react";
import { editDetailsMateri } from "./edit.action";
import { toast } from "sonner";


type DetailMateri = Awaited<ReturnType<typeof getDetailByMateriId>>;

export default function EditMateri() {

    const [details, setDetails] = useState<DetailMateri>([]);

    const materiId = useMateriIdState(state => state.id);
    const [submiting, setSubmiting] = useState(false);

    // const detailsMateri = await getDetailByMateriId(materiId);
    const getData = async () => {
        const res = await getDetailByMateriId(materiId);
        setDetails(res);
    };

    useEffect(() => {

        getData();
    }, [materiId])

    const formField: FormDetailMateriEntries[] = details.map(item => {
        return {
            transcript: item.transcript,
            file: item.image
        }
    });

    const onSubmit = async (data: { details: FormDetailMateriEntries[] }) => {
        try {
            setSubmiting(true);
            const formData = new FormData();
            formData.append("materiId", materiId);

            const prepData = data.details.map((item, index) => {
                if (item.file instanceof File) formData.append(`files[${index}]`, item.file);

                return {
                    transcript: item.transcript,
                    fileindex: item.file instanceof File ? index : null,
                    filename: typeof item.file === 'string' ? item.file : undefined
                }
            })

            formData.append("data", JSON.stringify(prepData));

            await editDetailsMateri(formData);
            getData();

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSubmiting(false);
        }
    }


    return (
        <>
            {details.length > 0 ? (
                <DetailMateriForm initialDetails={formField} onSubmit={onSubmit} submiting={submiting} />
            ) : (
                <p className="text-center">Tidak Ada Data</p>
            )}
        </>
    )
}