import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleUploadFile } from '@/lib/server/file';
import path from 'path';
import fs from 'fs/promises';

type FormEntry = {
  transcript: string;
  file: File | undefined;
};

export const config = {
  api: {
    bodyParser: false, // prevent 1MB limit and allow multipart
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const rawData = formData.get('data') as string;
    const materi = formData.get('name') as string;

    if (!rawData || !materi) {
      return NextResponse.json({ error: 'Data details tidak boleh kosong' }, { status: 400 });
    }

    const data = JSON.parse(rawData) as Array<{ transcript: string; fileindex: number | null }>;

    const finalDetails: FormEntry[] = data.map((item) => {
      const file = item.fileindex !== null ? (formData.get(`files[${item.fileindex}]`) as File) : undefined;
      return {
        transcript: item.transcript,
        file,
      };
    });

    const insertedMateri = await prisma.materi.create({
      data: {
        title: materi,
      },
    });

    for (let index = 0; index < finalDetails.length; index++) {
      const val = finalDetails[index];
      let filename = '';

      if (val.file) {
        filename = await handleUploadFile(val.file, 'uploads'); // or use handleUploadFile
      }

      await prisma.materiDetails.create({
        data: {
          image: filename,
          transcript: val.transcript,
          materi_id: insertedMateri.id,
          order_item: index,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
