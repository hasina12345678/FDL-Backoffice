// services/api/uploadService.js
import { getAuthHeaders } from "./genericService";
const UPLOAD_URL = `${import.meta.env.VITE_API_URL}/upload`;

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
            ...getAuthHeaders(),
            // Pas de Content-Type ici : le navigateur le fixe lui-même avec le boundary multipart
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Erreur lors de l'upload du fichier.");
    }

    return res.json(); // { url, width, height, color }
}