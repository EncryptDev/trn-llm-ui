"use server"

import { prisma } from "../prisma";

export const getDetailByMateriId = async (materiId: string) => {
    try {
        return await prisma.materiDetails.findMany({
            where: {
                materi_id: materiId
            }
        });

    } catch (error) {
        throw error;
    }
}