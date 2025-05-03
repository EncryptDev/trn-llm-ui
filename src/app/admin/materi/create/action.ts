"use server"

import { prisma } from "@/lib/prisma";
import { handleUploadFile } from "@/lib/server/file";


type FormEntry = {
    transcript: string;
    file: File | undefined;
}

export async function createMateri(formData: FormData) {
    try {

        const rawData = formData.get("data") as string;

        if (!rawData) {
            throw new Error("Data details tidak boleh kosong");
        }
        const materi = formData.get("name") as string;
        const data = JSON.parse(rawData) as Array<{ transcript: string, fileindex: number | null }>

        const finalDetails: FormEntry[] = data.map((item, index) => {
            const file = item.fileindex !== null ? formData.get(`files[${item.fileindex}]`) as File : undefined;
            return {
                transcript: item.transcript,
                file
            }
        })

        // create materi
        const insertedMateri = await prisma.materi.create({
            data: {
                title: materi
            }
        });

        

        // handle details
        finalDetails.forEach(async (val, index) => {

            let filename = ""

            if (val.file) {
                filename = await handleUploadFile(val.file, "uploads");
            }
        

            await prisma.materiDetails.create({
                data: {
                    image: filename,
                    transcript: val.transcript,
                    materi_id: insertedMateri.id,
                    order_item: index
                }
            });

        });

    } catch (error) {
        throw error;
    }
}