// components/ActualiteForm/MediaList.jsx
import { useState } from "react";
import { uploadMedia } from "../../services/api/mediaUploadService";
import "./MediaList.css";

const ACCEPT_BY_KIND = {
    photos: "image/*",
    videos: "video/*",
    documents: ".pdf,.doc,.docx,.xls,.xlsx,.txt",
};

const LABEL_BY_KIND = {
    photos: "Photo",
    videos: "Vidéo",
    documents: "Document",
};

function MediaList({ kind, items, onChange }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleAdd = async (file) => {
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const result = await uploadMedia(file);
            const newItem = {
                tempId: crypto.randomUUID(),
                url: result.url,
                description: "",
                ordre: items.length + 1,
                meta: result, // width/height/color/duration/originalFilename... gardés pour affichage
            };
            onChange([...items, newItem]);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = (tempId) => {
        const next = items
            .filter((i) => i.tempId !== tempId)
            .map((i, idx) => ({ ...i, ordre: idx + 1 })); // réordonne après suppression
        onChange(next);
    };

    const handleDescriptionChange = (tempId, value) => {
        onChange(items.map((i) => (i.tempId === tempId ? { ...i, description: value } : i)));
    };

    const handleMove = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= items.length) return;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next.map((i, idx) => ({ ...i, ordre: idx + 1 })));
    };

    return (
        <div className="media-list">
            <div className="media-list__header">
                <span className="media-list__label">{LABEL_BY_KIND[kind]}s</span>
                <label className="media-list__add-btn">
                    {!uploading && <svg className="media-list__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>}
                    {uploading ? "Envoi..." : "Ajouter"}
                    <input
                        type="file"
                        accept={ACCEPT_BY_KIND[kind]}
                        onChange={(e) => handleAdd(e.target.files[0])}
                        disabled={uploading}
                        hidden
                    />
                </label>
            </div>

            {error && <p className="media-list__error">{error}</p>}

            {items.length === 0 ? (
                <p className="media-list__empty">Aucun {LABEL_BY_KIND[kind].toLowerCase()} ajouté.</p>
            ) : (
                <ul className="media-list__items">
                    {items.map((item, idx) => (
                        <li className="media-list__item" key={item.tempId}>
                            <div className="media-list__preview">
                                {kind === "photos" && <img src={item.url} alt="" />}
                                {kind === "videos" && <video src={item.url} muted />}
                                {kind === "documents" && (
                                    <div className="media-list__file-icon">
                                        <svg className="media-list__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5" /></svg>
                                        <span>{item.meta?.originalFilename || "Document"}</span>
                                    </div>
                                )}
                            </div>

                            <input
                                type="text"
                                className="media-list__desc-input"
                                placeholder="Description (optionnel)"
                                value={item.description}
                                onChange={(e) => handleDescriptionChange(item.tempId, e.target.value)}
                            />

                            <div className="media-list__actions">
                                <button type="button" onClick={() => handleMove(idx, -1)} disabled={idx === 0} title="Monter" aria-label="Monter">
                                    <svg className="media-list__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6" /></svg>
                                </button>
                                <button type="button" onClick={() => handleMove(idx, 1)} disabled={idx === items.length - 1} title="Descendre" aria-label="Descendre">
                                    <svg className="media-list__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                                <button type="button" className="media-list__remove" onClick={() => handleRemove(item.tempId)} title="Supprimer" aria-label="Supprimer">
                                    <svg className="media-list__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MediaList;