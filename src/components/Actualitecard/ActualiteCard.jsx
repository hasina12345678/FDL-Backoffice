// components/ActualiteCard/ActualiteCard.jsx
import "./ActualiteCard.css";

const PLACEHOLDER_COVER = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
    <rect width="400" height="260" fill="#F1F5F9"/>
    <rect x="135" y="55" width="130" height="120" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>
    <circle cx="235" cy="88" r="12" fill="#CBD5E1"/>
    <path d="M150 155L185 120L210 142L225 128L250 155H150Z" fill="#CBD5E1"/>
    <text x="200" y="205" text-anchor="middle" fill="#64748B" font-family="Arial, sans-serif" font-size="16">
        Pas de couverture
    </text>
</svg>
`)}`;

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "—";
    }
}

function ActualiteCard({ actualite, onView, onEdit, onDelete }) {
    const imageUrl = actualite.cover || PLACEHOLDER_COVER;

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(actualite);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(actualite.id);
    };

    return (
        <div className="actualite-card" onClick={() => onView(actualite)}>
            <div className="actualite-card__image-wrapper">
                <img src={imageUrl} alt={actualite.title} className="actualite-card__image" />

                {!actualite.auteurId && (
                    <span className="actualite-card__badge actualite-card__badge--warning">
                        Sans auteur
                    </span>
                )}
            </div>

            <div className="actualite-card__body">
                <div className="actualite-card__meta">
                    <span className="actualite-card__date">{formatDate(actualite.createdAt)}</span>
                    {actualite.location && (
                        <span className="actualite-card__location">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {actualite.location}
                        </span>
                    )}
                </div>

                <h3 className="actualite-card__title">{actualite.title}</h3>

                {actualite.summary && (
                    <p className="actualite-card__summary">{actualite.summary}</p>
                )}

                {actualite.categories?.length > 0 && (
                    <div className="actualite-card__categories">
                        {actualite.categories.slice(0, 3).map((cat) => (
                            <span key={cat} className="actualite-card__category-chip">{cat}</span>
                        ))}
                        {actualite.categories.length > 3 && (
                            <span className="actualite-card__category-chip actualite-card__category-chip--more">
                                +{actualite.categories.length - 3}
                            </span>
                        )}
                    </div>
                )}

                <div className="actualite-card__footer">
                    <span className="actualite-card__auteur">
                        {actualite.auteurNom || "Auteur non renseigné"}
                    </span>

                    <div className="actualite-card__actions">
                        <button className="actualite-card__btn" onClick={handleEditClick}>
                            Modifier
                        </button>
                        <button
                            className="actualite-card__btn actualite-card__btn--delete"
                            onClick={handleDeleteClick}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActualiteCard;