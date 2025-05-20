"use server"

import { unlink, writeFile, mkdir } from "fs/promises";
import path from "path";

export async function handleUploadFile(file: File, savePath: string, randomizeName: boolean = false) {
    try {
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            console.log(`Save path:${savePath}`)


            const uploadDir = path.join(process.cwd(), `public/${savePath}`);
            console.log(`Upload dir:${uploadDir}`);

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

export async function handleDeleteFile( filePath: string) {
    try {
        const fullPath = path.join(process.cwd(), `public/${filePath}`);
        await unlink(fullPath);
        return true;
    } catch (error) {
        throw error;
    }
}
