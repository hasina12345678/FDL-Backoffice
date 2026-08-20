// services/api/mediaUploadService.js
import { getAuthHeaders } from "./genericService";

const MEDIA_UPLOAD_URL = `${import.meta.env.VITE_API_URL}/media/upload`;

export async function uploadMedia(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(MEDIA_UPLOAD_URL, {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur lors de l'upload du fichier.");
    }

    return res.json(); // { url, type, width?, height?, color?, duration?, originalFilename?, bytes? }
}