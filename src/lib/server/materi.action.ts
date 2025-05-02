"use server"

import { prisma } from "../prisma";

export const getAllMateri = async () => {
    try {
        return await prisma.materi.findMany();
    } catch (error) {
        throw error;
    }
}