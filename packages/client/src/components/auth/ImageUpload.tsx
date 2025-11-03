'use client';
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api'; // Import api client
import { useToast } from '@/hooks/use-toast';

type ImageUploadProps = {
    // Callback này giờ sẽ trả về number (ID của media file)
    onImageUpload: (mediaId: number) => void;
};

// Định nghĩa API call để lưu media
const saveMediaFile = async (fileUrl: string, filePath: string, fileType: string) => {
    // === SỬA TÊN BIẾN GỬI ĐI ===
    const response = await api.post('/public/media', {
        file_url: fileUrl,   // Gửi đi snake_case
        file_path: filePath, // Gửi đi snake_case
        file_type: fileType, // Gửi đi snake_case
    });
    // ========================
    return response.data;
};

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");
    const { toast } = useToast();

    // Mutation để lưu file URL về server
    const mutation = useMutation({
        mutationFn: (variables: { fileUrl: string, filePath: string, fileType: string }) =>
            saveMediaFile(variables.fileUrl, variables.filePath, variables.fileType),
        onSuccess: (response) => {
            onImageUpload(response.data.id);
            toast({ title: "Tải ảnh lên thành công!" });
            setUploading(false);
        },
        onError: (error) => {
            console.error('Failed to save media file:', error);
            toast({ variant: "destructive", title: "Lỗi", description: "Không thể lưu file về server." });
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
                toast({ variant: "destructive", title: "Lỗi", description: "Tải file lên Firebase thất bại." });
            },
            () => {
                // Upload lên Firebase thành công, lấy URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // BƯỚC 2: Gửi URL này về server
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
        // ... (giữ nguyên phần JSX return)
        <div className="w-full space-y-2">
            <Label htmlFor="avatar-upload" className="sr-only">Chọn ảnh</Label>
            <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                disabled={uploading}
                className="cursor-pointer file:text-sm file:font-medium file:text-primary-foreground file:bg-primary hover:file:bg-primary/90"
            />
            {uploading && (
                <div className='mt-2 space-y-1'>
                    <p className="text-sm text-muted-foreground">
                        {mutation.isPending ? 'Đang lưu về server...' : `Đang tải ${fileName}: ${Math.round(uploadProgress)}%`}
                    </p>
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}
        </div>
    );
}