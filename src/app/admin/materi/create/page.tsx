"use client"


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { createMateri } from "./action";
import DetailMateriForm from "@/components/form/DetailMateriForm";
import { FormDetailMateriEntries } from "@/types/form";


export default function CreatePage() {

    const [materi, setMateri] = useState("");
    const [submiting, setSubmiting] = useState(false);


    const onSubmit = async (data: { details: FormDetailMateriEntries[] }) => {
        setSubmiting(true)
        try {
            if (!materi) throw new Error("Materi harus diisi");

            console.log(data);
            const formData = new FormData();
            formData.append("name", materi);

            //siapkan data dengan prop file terpisah
            const preparedData = data.details.map((details, index) => {
                // Tambahkan file satu persatu
                if (details.file) {
                    formData.append(`files[${index}]`, details.file);
                }
                return {
                    transcript: details.transcript,
                    fileindex: details.file ? index : null
                }
            });
            formData.append("data", JSON.stringify(preparedData));

            await createMateri(formData);
            toast.success("Materi berhasil ditambahkan")
            // reset();



        } catch (error: any) {
            toast.warning(error.message);
        } finally {
            setSubmiting(false)
        }
    }


    return (
        <div className="px-12 py-12">
            {/* Materi Form */}
            <div className="mb-5">
            <Label>Isi Nama Materi</Label>
            <Input value={materi} onChange={(e) => setMateri(e.target.value)} />
            </div>

            <DetailMateriForm onSubmit={onSubmit} 
                initialDetails={[{transcript: "", file: undefined}]}
            />


        </div>
    )
}