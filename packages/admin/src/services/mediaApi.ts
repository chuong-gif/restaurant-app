// packages/admin/src/services/mediaApi.ts
import { baseApi } from './baseApi';
import { MediaFile } from '../types/product';

interface CreateMediaFileRequest {
    file_url: string;
    file_path: string;
    file_type: string;
}

interface CreateMediaFileResponse {
    message: string;
    data: MediaFile; // API trả về object media file (có ID)
}

export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation để lưu thông tin file vào CSDL sau khi upload lên Firebase
        createMediaFile: builder.mutation<CreateMediaFileResponse, CreateMediaFileRequest>({
            query: (mediaData) => ({
                url: '/admin/media', // Dựa trên file media.routes.ts và index.ts của server
                method: 'POST',
                body: mediaData,
            }),
            // Không cần invalidatesTags vì nó không ảnh hưởng ds sản phẩm
        }),
    }),
});

export const { useCreateMediaFileMutation } = mediaApi;