// packages/admin/src/components/common/ImageUpload.tsx
import React,
{
    useState,
    useEffect
} from 'react';
import {
    Upload,
    Modal,
    Progress,
    message
} from 'antd';
import {
    PlusOutlined
} from '@ant-design/icons';
import type {
    UploadFile,
    UploadProps
} from 'antd/es/upload/interface';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import {
    storage
} from '../../configs/firebase'; // Import config firebase
import {
    useCreateMediaFileMutation
} from '../../services/mediaApi';

// Hàm lấy base64 (cần cho Ant Design preview)
const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface ImageUploadProps {
    value?: number | null; // Nhận vào hinh_anh_id
    onChange?: (id: number | null) => void; // Trả về hinh_anh_id
    initialImageUrl?: string | null; // URL ảnh ban đầu (cho chế độ edit)
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    initialImageUrl
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [createMediaFile, {
        isLoading
    }] = useCreateMediaFileMutation();

    // Hiển thị ảnh ban đầu (khi edit)
    useEffect(() => {
        if (initialImageUrl && value) {
            setFileList([{
                uid: String(value),
                name: 'image.png',
                status: 'done',
                url: initialImageUrl,
            },]);
        } else {
            setFileList([]);
        }
    }, [initialImageUrl, value]);

    const handleCancelPreview = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({
        file,
        fileList: newFileList
    }) => {
        // Chỉ cập nhật fileList khi không phải là đang upload
        if (file.status !== 'uploading') {
            setFileList(newFileList);
        }
    };

    const customUploadRequest: UploadProps['customRequest'] = async (options) => {
        const {
            file,
            onSuccess,
            onError,
            onProgress
        } = options;
        const fileAsFile = file as File;

        const filePath = `products/${Date.now()}_${fileAsFile.name}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, fileAsFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
                onProgress?.({
                    percent: progress
                });
            },
            (error) => {
                console.error('Upload failed:', error);
                message.error('Upload ảnh thất bại.');
                onError?.(error);
                setUploadProgress(0);
            },
            async () => {
                try {
                    // 1. Lấy URL ảnh từ Firebase
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // 2. Lưu thông tin ảnh vào CSDL (qua server của mình)
                    const mediaResponse = await createMediaFile({
                        file_url: downloadURL,
                        file_path: filePath,
                        file_type: fileAsFile.type,
                    }).unwrap();

                    const newMediaId = mediaResponse.data.id;

                    // 3. Trả về ID của ảnh
                    onChange?.(newMediaId);
                    onSuccess?.(mediaResponse.data);
                    message.success('Upload ảnh thành công.');

                    // Cập nhật fileList để hiển thị ảnh vừa upload
                    setFileList([{
                        uid: String(newMediaId),
                        name: fileAsFile.name,
                        status: 'done',
                        url: downloadURL,
                    },]);
                } catch (err) {
                    console.error('Failed to save media file:', err);
                    message.error('Lưu thông tin ảnh thất bại.');
                    onError?.(new Error('Lưu thông tin ảnh thất bại.'));
                } finally {
                    setUploadProgress(0);
                }
            }
        );
    };

    const handleRemove: UploadProps['onRemove'] = async (file) => {
        // Xóa file khỏi Firebase (tùy chọn, nhưng nên làm)
        if (file.url) {
            try {
                // Lấy file_path từ file_url
                const url = new URL(file.url);
                const filePath = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);

                if (filePath) {
                    const fileRef = ref(storage, filePath);
                    await deleteObject(fileRef);
                    message.info('Đã xóa ảnh cũ khỏi Firebase.');
                }
            } catch (error) {
                console.error("Lỗi khi xóa file trên Firebase:", error);
            }
        }

        // Xóa file khỏi CSDL (bằng cách set hinh_anh_id = null)
        onChange?.(null);
        setFileList([]); // Xóa file khỏi giao diện
        return true;
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove}
                customRequest={customUploadRequest}
                maxCount={1}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {uploadProgress > 0 && <Progress percent={Math.round(uploadProgress)} />}
            <Modal open={previewOpen} footer={null} onCancel={handleCancelPreview}>
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default ImageUpload;