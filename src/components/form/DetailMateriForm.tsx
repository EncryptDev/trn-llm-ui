"use client"

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader, Loader2Icon, Save, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { getFilePreviewUrl } from "@/lib/utils";
import { FormDetailMateriEntries } from "@/types/form";


interface DetailMateriFormProps {
    onSubmit: (data: { details: FormDetailMateriEntries[] }) => void;
    initialDetails?: FormDetailMateriEntries[];
    submiting?: boolean;

}

export default function DetailMateriForm({
    onSubmit,
    initialDetails,
    submiting
}: DetailMateriFormProps) {

    const {
        control,
        handleSubmit,
        reset
    } = useForm<{ details: FormDetailMateriEntries[] }>({
        defaultValues: {
            details: initialDetails
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "details"
    });

    useEffect(() => {
        reset({ details: initialDetails })
    }, [initialDetails, reset]);

    const handleFormSubmit = (data: { details: FormDetailMateriEntries[] }) => {
        onSubmit(data);
    }

    return (
        <Card className="w-full min-w-6xl">
            <CardContent className="space-y-6">

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        onClick={() => append({ transcript: '', file: undefined })}
                    >
                        Tambah Form
                    </Button>
                    <Button variant="destructive" type="button" onClick={() => reset()}>
                        Reset Form
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div
                        className="mt-4 p-4 border rounded-md space-y-4 w-full"
                        key={field.id}
                    >
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

                        <div className="space-y-4">
                            <Label>File</Label>
                            <Controller
                                control={control}
                                name={`details.${index}.file`}
                                render={({ field }) => {
                                    const currentValue = field.value
                                    const previewUrl =
                                        typeof currentValue === 'string'
                                            ? getFilePreviewUrl(currentValue)
                                            : currentValue instanceof File
                                                ? URL.createObjectURL(currentValue)
                                                : null

                                    return (
                                        <div className="space-y-2">
                                            <Input
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        field.onChange(file)
                                                    }
                                                }}
                                            />

                                            {previewUrl && (
                                                <div className="mt-2">
                                                    <Label className="text-sm text-muted-foreground">Preview:</Label>
                                                    <div className="mt-1">
                                                        <a
                                                            href={previewUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline text-sm"
                                                        >
                                                            {typeof currentValue === 'string'
                                                                ? 'Lihat file lama'
                                                                : 'Lihat file yang baru dipilih'}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>

            <CardFooter>
                <Button onClick={handleSubmit(handleFormSubmit)} disabled={submiting}>
                    {submiting ? (
                        <>
                            <Loader2Icon className="animate-spin" />
                            Submiting
                        </>
                    ) : (
                        <>
                            <Save />
                            Submit
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>

    )
}