// ImageUpload.tsx
'use client';
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type ImageUploadProps = {
    onImageUpload: (mediaId: number) => void;
};

const saveMediaFile = async (fileUrl: string, filePath: string, fileType: string) => {
    const response = await api.post('/public/media', {
        file_url: fileUrl,
        file_path: filePath,
        file_type: fileType,
    });
    return response.data;
};

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: (variables: { fileUrl: string, filePath: string, fileType: string }) =>
            saveMediaFile(variables.fileUrl, variables.filePath, variables.fileType),
        onSuccess: (response) => {
            onImageUpload(response.data.id);
            toast({ title: "🌀 Upload complete" });
            setUploading(false);
        },
        onError: (error) => {
            console.error('Failed to save media file:', error);
            toast({ variant: "destructive", title: "Upload failed", description: "Neural transfer interrupted" });
            setUploading(false);
        },
    });

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const filePath = `images/avatars/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filePath);
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
                console.error('Upload to Firebase failed:', error);
                setUploading(false);
                toast({ variant: "destructive", title: "Firebase error", description: "Quantum transfer failed" });
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    mutation.mutate({
                        fileUrl: downloadURL,
                        filePath: filePath,
                        fileType: file.type || 'image',
                    });
                });
            }
        );
    };

    return (
        <div className="w-full space-y-4">
            <div className="space-y-2">
                <Label htmlFor="avatar-upload" className="text-cyan-300 font-mono text-sm">Tải lên hình ảnh</Label>
                <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    disabled={uploading}
                    className="cursor-pointer bg-[#0a0a0f]/60 border border-cyan-500/30 text-cyan-100 backdrop-blur-lg file:bg-gradient-to-r file:from-cyan-600 file:to-purple-600 file:border-0 file:text-white file:font-mono file:text-sm hover:file:from-cyan-500 hover:file:to-purple-500 transition-all duration-300"
                />
            </div>

            {uploading && (
                <div className='space-y-3 p-4 bg-[#0a0a0f]/40 border border-cyan-500/20 rounded-lg'>
                    <div className="flex justify-between items-center">
                        <p className="text-cyan-300 font-mono text-sm">
                            {mutation.isPending ? '🔁 Syncing with core...' : `⚡ Uploading: ${Math.round(uploadProgress)}%`}
                        </p>
                        <span className="text-cyan-400/60 text-xs font-mono">{fileName}</span>
                    </div>
                    <div className="space-y-2">
                        <Progress
                            value={uploadProgress}
                            className="h-2 bg-[#0a0a0f] border border-cyan-500/20"
                        />
                        <div className="flex justify-between text-xs text-cyan-400/60 font-mono">
                            <span>Quantum Transfer</span>
                            <span>{Math.round(uploadProgress)}%</span>
                        </div>
                    </div>
                </div>
            )}

            {!uploading && (
                <div className="text-center p-4 border border-cyan-500/20 rounded-lg bg-[#0a0a0f]/20">
                    <p className="text-cyan-400/60 text-xs font-mono">Sẵn sàng cho truyền tải hình ảnh</p>
                </div>
            )}
        </div>
    );
}