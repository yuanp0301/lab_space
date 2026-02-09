import api from "./index";

export type UploadResponse = {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  base64: string;
};

export type FileInfo = {
  id: string;
  filename: string;
  size: number;
};

export const filesApi = {
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getInfo: (id: string) => api.get<FileInfo>(`/files/${id}`),

  delete: (id: string) => api.delete(`/files/${id}`),
};
