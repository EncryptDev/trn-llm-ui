"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import FileUpload from './FileUpload'


function UploadPage() {

    const [data, setData] = useState<string[]>([]);


    const fetchData = async () => {
        const pdfs = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pdfs`, {
            method: "GET",
            cache: "no-store"
        });
        const result = await pdfs.json() as string[];
        setData(result);
    };

    const handleDelete = async (filename: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({filename})
        });

        if (response.ok) {
            fetchData();
        }
    }

    useEffect(() => {
        fetchData();
    }, [])



    return (
        <div className='px-6 py-8 '>
            <FileUpload callBack={() => { fetchData() }} />
            <div>
                <Card className="w-xl mx-auto mt-12">
                    <CardHeader>
                        <CardTitle>Daftar File Pdf</CardTitle>
                        <CardDescription>Anda bisa menghapus file pdf untuk menghilangi pengetahuan AI</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {data.map(val => (
                            <Card key={`pdf-${val}`} className='w-full bg-gray-100'>
                                <CardContent className='flex gap-4 items-center'>
                                    <Image src={'/pdf.png'} alt='pdf' width={40} height={40} />
                                    <p className='text-black text-lg font-semibold flex-1'>{val}</p>
                                    <Button variant={"destructive"}
                                        onClick={() => handleDelete(val) }
                                    >
                                        <Trash2 />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UploadPage
