"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner";
import { createMateri } from "./action";


type FormEntry = {
    transcript: string;
    file: File | undefined;
}


export default function CreatePage() {

    const [materi, setMateri] = useState("");
    const [submiting, setSubmiting] = useState(false);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<{ details: FormEntry[] }>({
        defaultValues: {
            details: [
                {
                    transcript: "",
                    file: undefined
                }
            ]
        }
    });


    const { fields, append, remove } = useFieldArray({
        control,
        name: "details",
    });

    const onSubmit = async (data: { details: FormEntry[] }) => {
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
            <Card>
                <CardContent>
                    {/* Materi Form */}
                    <Label>Isi Nama Materi</Label>
                    <Input value={materi} onChange={(e) => setMateri(e.target.value)} />

                    {/* Detail Form */}

                    <div className="flex gap-4 justify-end">
                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    transcript: "",
                                    file: undefined
                                })
                            }
                        >
                            Tambah Form
                        </Button>
                        <Button variant="destructive" type="button" onClick={() => reset()}>
                            Reset Form
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <div className="mt-4 p-4 border rounded-md space-y-4 w-full min-w-6xl" key={field.id}>

                            {/* Delete  button */}
                            <div className="flex justify-between items-center">
                                <Label>Data ke {index + 1}</Label>

                                {fields.length > 1 && (
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        size="icon"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}

                            </div>

                            {/* Input Transcript */}
                            <div className="space-y-4">
                                <Label>Transcript</Label>
                                <Controller
                                    control={control}
                                    name={`details.${index}.transcript`}
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder="Input Transcript" />
                                    )}
                                />
                            </div>

                            {/* Input File */}
                            <div className="space-y-4">
                                <Label>File</Label>
                                <Controller
                                    control={control}
                                    name={`details.${index}.file`}
                                    render={({ field }) => (
                                        <Input type="file" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                field.onChange(file);
                                            }
                                        }} />
                                    )}
                                />
                            </div>
                        </div>
                    ))}

                </CardContent>

                <CardFooter>
                    <Button onClick={handleSubmit(onSubmit)}>
                        <Save /> Submit
                    </Button>
                </CardFooter>
            </Card>

        </div>
    )
}