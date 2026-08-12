// components/RealisationCard/RealisationCard.jsx
import "./RealisationCard.css";
import { BASE_URL } from "../../services/api/config";

const PLACEHOLDER_IMG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
    <rect width="400" height="260" fill="#F1F5F9"/>
    <rect x="135" y="55" width="130" height="120" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>
    <circle cx="235" cy="88" r="12" fill="#CBD5E1"/>
    <path d="M150 155L185 120L210 142L225 128L250 155H150Z" fill="#CBD5E1"/>
    <text x="200" y="205" text-anchor="middle" fill="#64748B" font-family="Arial, sans-serif" font-size="16">
        Pas de photo
    </text>
</svg>
`)}`;
function RealisationCard({ realisation, onView, onEdit, onDelete }) {
    const imageUrl = realisation.photo
        ? `${BASE_URL}${realisation.photo}`
        : PLACEHOLDER_IMG;

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(realisation);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(realisation.id);
    };

    return (
        <div className="realisation-card" onClick={() => onView(realisation)}>
            <div className="realisation-card__image-wrapper">
                <img src={imageUrl} alt={realisation.title} className="realisation-card__image" />
                {realisation.categorieName && (
                    <span className="realisation-card__badge">{realisation.categorieName}</span>
                )}
            </div>

            <div className="realisation-card__body">
                <h3 className="realisation-card__title">{realisation.title}</h3>

                <div className="realisation-card__meta">
                    <span className="realisation-card__meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {realisation.communeName}
                    </span>

                    {realisation.annee && (
                        <span className="realisation-card__meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {realisation.annee}
                        </span>
                    )}
                </div>

                <div className="realisation-card__actions">
                    <button className="realisation-card__btn" onClick={handleEditClick}>
                        Modifier
                    </button>
                    <button
                        className="realisation-card__btn realisation-card__btn--delete"
                        onClick={handleDeleteClick}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RealisationCard;