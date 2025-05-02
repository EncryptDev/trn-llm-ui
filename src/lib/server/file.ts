"use server"

import { unlink, writeFile, mkdir } from "fs/promises";
import path from "path";

export async function handleUploadFile(file: File, savePath: string, randomizeName: boolean = false) {
    try {
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), `public/${savePath}`);

            // ✅ Pastikan folder ada
            await mkdir(uploadDir, { recursive: true });

            // Extract ext
            const ext = path.extname(file.name);
            const baseName = randomizeName
                ? crypto.randomUUID()
                : path.basename(file.name, ext);

            const finalName = `${baseName}${ext}`;

            const filePath = path.join(uploadDir, finalName);

            await writeFile(filePath, buffer);

            return `${savePath}/${finalName}`;
        } else {
            throw new Error("Tidak ada file");
        }
    } catch (err) {
        throw err;
    }

}

export async function handleDeleteFile(fileName: string, filePath: string) {
    try {
        const fullPath = path.join(process.cwd(), filePath, fileName);
        await unlink(fullPath);
        return true;
    } catch (error) {
        throw error;
    }
}
