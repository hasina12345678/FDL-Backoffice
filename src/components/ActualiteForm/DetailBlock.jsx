// components/ActualiteForm/DetailBlock.jsx
import MediaList from "./MediaList";
import "./DetailBlock.css";

function DetailBlock({ block, index, onChange, onRemove }) {
    const update = (field, value) => {
        onChange({ ...block, [field]: value });
    };

    return (
        <div className="detail-block">
            <div className="detail-block__header">
                <span className="detail-block__badge">Section {index + 1}</span>
                <button type="button" className="detail-block__remove" onClick={onRemove}>
                    <svg className="detail-block__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="m19 6-1 14H6L5 6" />
                    </svg>
                    Supprimer cette section
                </button>
            </div>

            <div className="detail-block__field">
                <label>Sous-titre</label>
                <input
                    type="text"
                    value={block.subtitle}
                    onChange={(e) => update("subtitle", e.target.value)}
                    placeholder="Ex: Le contexte du projet"
                />
            </div>

            <div className="detail-block__field">
                <label>Paragraphe</label>
                <textarea
                    rows={5}
                    value={block.paragraphe}
                    onChange={(e) => update("paragraphe", e.target.value)}
                    placeholder="Contenu de cette section..."
                />
            </div>

            <div className="detail-block__media-grid">
                <MediaList kind="photos" items={block.photos} onChange={(v) => update("photos", v)} />
                <MediaList kind="videos" items={block.videos} onChange={(v) => update("videos", v)} />
                <MediaList kind="documents" items={block.documents} onChange={(v) => update("documents", v)} />
            </div>
        </div>
    );
}

export default DetailBlock;