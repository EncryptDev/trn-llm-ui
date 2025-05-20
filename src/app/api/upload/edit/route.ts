import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';
import { handleUploadFile } from '@/lib/server/file';

type FormDetailMateriEntries = {
  transcript: string;
  file: File | string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const materiId = formData.get('materiId') as string;
    if (!materiId) {
      return NextResponse.json({ error: 'Materi ID tidak boleh kosong' }, { status: 400 });
    }

    const rawData = formData.get('data') as string;
    if (!rawData) {
      return NextResponse.json({ error: 'Data tidak boleh kosong' }, { status: 400 });
    }

    const parsedData = JSON.parse(rawData) as Array<{
      transcript: string;
      fileindex: number | null;
      filename?: string;
    }>;

    const finalData: FormDetailMateriEntries[] = parsedData.map((item) => {
      const file = item.fileindex !== null
        ? (formData.get(`files[${item.fileindex}]`) as File)
        : (item.filename ?? '');
      return {
        transcript: item.transcript,
        file,
      };
    });

    // Hapus semua materiDetails lama
    await prisma.materiDetails.deleteMany({
      where: {
        materi_id: materiId,
      },
    });

    // Simpan ulang detail materi
    for (let index = 0; index < finalData.length; index++) {
      const item = finalData[index];

      let filename = '';
      if (typeof item.file === 'string') {
        filename = item.file;
      } else if (item.file instanceof File) {
        filename = await handleUploadFile(item.file, 'uploads');
      }

      await prisma.materiDetails.create({
        data: {
          image: filename,
          transcript: item.transcript,
          materi_id: materiId,
          order_item: index,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error editing materi details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}