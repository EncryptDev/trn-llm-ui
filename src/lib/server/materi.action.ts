"use server"

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";

export const getAllMateri = async () => {
    try {
        return await prisma.materi.findMany();
    } catch (error) {
        throw error;
    }
}

export async function deleteMateri(id: string) {
    try {
         await prisma.materi.delete({
            where: {
                id
            }
        });
        revalidatePath('/admin/materi');

    } catch (error) {
        throw error;
    }
}