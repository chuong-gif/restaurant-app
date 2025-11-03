'use client';
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase'; // Import config firebase
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageUploadProps = {
    onImageUpload: (url: string) => void;
};

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Lấy file từ input
        if (!file) return;

        setFileName(file.name);
        // Logic upload y hệt file ImageUpload.js gốc [cite: 17-21]
        const storageRef = ref(storage, `images/avatars/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploading(true);
        setUploadProgress(0);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error('Upload failed:', error);
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    onImageUpload(downloadURL); // Gửi URL về form
                    setUploading(false);
                });
            }
        );
    };

    return (
        <div className="w-full space-y-2">
            <Label htmlFor="avatar-upload" className="sr-only">Chọn ảnh</Label>
            <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={onFileChange} // Dùng handler mới
                disabled={uploading}
                className="cursor-pointer file:text-sm file:font-medium file:text-primary-foreground file:bg-primary hover:file:bg-primary/90"
            />
            {uploading && (
                <div className='mt-2 space-y-1'>
                    <p className="text-sm text-muted-foreground">Đang tải {fileName}: {Math.round(uploadProgress)}%</p>
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}
        </div>
    );
}