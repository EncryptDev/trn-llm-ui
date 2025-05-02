"use server";

import { prisma } from "@/lib/prisma";
import { handleDeleteFile, handleUploadFile } from "@/lib/server/file";
import { FormDetailMateriEntries } from "@/types/form";

export const editDetailsMateri = async (formData: FormData) => {
    try {

        const materiId = formData.get("materiId") as string;
        if (!materiId) throw new Error("Materi id tidak boleh kosong");

        const rawData = formData.get("data") as string;
        if (!rawData) throw new Error("Data tidak boleh kosong");

        const parsedData = JSON.parse(rawData) as Array<{ transcript: string, fileindex: number | null, filename?: string }>;

        const finalData: FormDetailMateriEntries[] = parsedData.map((item, index) => {
            const file = item.fileindex !== null ? formData.get(`files[${item.fileindex}]`) as File : item.filename;
            return {
                transcript: item.transcript,
                file
            }
        });

        // Delete semua fil

        await prisma.materiDetails.deleteMany({
            where: {
                materi_id: materiId
            }
        });

        finalData.forEach(async (item, _) => {

            let filename=""
            if(typeof item.file === "string") filename = item.file
            if(item.file instanceof File) filename = await handleUploadFile(item.file, "uploads");


            await prisma.materiDetails.create({
                data: {
                    image: filename,
                    transcript:item.transcript,
                    materi_id: materiId
                }
            })
        });

    } catch (error) {
        throw error;
    }
}