"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2Icon, Send } from 'lucide-react';
import React, { useState } from 'react'

function FileUpload({ callBack }: { callBack?: () => void }) {

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                if (callBack) callBack();
            }

        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className='mx-auto text-center text-black text-2xl font-bold'>Upload File PDF</h1>

            <div className='max-w-xl mx-auto mt-12'>
                <Label htmlFor='file'>Upload File</Label>
                <div className='mt-4 flex gap-4'>
                    <Input id='file' type='file' onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                    <Button onClick={handleSubmit}>
                        {loading ? (
                            <Loader2Icon className='animate-spin' />
                        ) : (
                            <Send />
                        )}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default FileUpload
