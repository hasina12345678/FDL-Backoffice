// components/RealisationDetail/RealisationDetail.jsx
import "./RealisationDetail.css";

const PLACEHOLDER_IMG = "https://via.placeholder.com/700x400?text=Pas+de+photo";

function formatMontant(montant) {
    if (montant === null || montant === undefined) return "—";
    return new Intl.NumberFormat("fr-FR").format(montant) + " Ar";
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function RealisationDetail({ realisation }) {
    const imageUrl = realisation.photo
        ? `http://localhost:8080${realisation.photo}`
        : PLACEHOLDER_IMG;

    return (
        <div className="realisation-detail">
            <div className="realisation-detail__image-wrapper">
                <img src={imageUrl} alt={realisation.title} className="realisation-detail__image" />
                {realisation.categorieName && (
                    <span className="realisation-detail__badge">{realisation.categorieName}</span>
                )}
            </div>

            <h2 className="realisation-detail__title">{realisation.title}</h2>

            {realisation.summary && (
                <p className="realisation-detail__summary">{realisation.summary}</p>
            )}

            <div className="realisation-detail__grid">
                <div className="realisation-detail__item">
                    <span className="realisation-detail__label">Commune</span>
                    <span className="realisation-detail__value">{realisation.communeName || "—"}</span>
                </div>

                <div className="realisation-detail__item">
                    <span className="realisation-detail__label">Programme</span>
                    <span className="realisation-detail__value">{realisation.programmeName || "—"}</span>
                </div>

                <div className="realisation-detail__item">
                    <span className="realisation-detail__label">Source de financement</span>
                    <span className="realisation-detail__value">{realisation.sourceFinancementName || "—"}</span>
                </div>

                <div className="realisation-detail__item">
                    <span className="realisation-detail__label">Année</span>
                    <span className="realisation-detail__value">{realisation.annee || "—"}</span>
                </div>

                <div className="realisation-detail__item">
                    <span className="realisation-detail__label">Date de réalisation</span>
                    <span className="realisation-detail__value">{formatDate(realisation.dateRealisation)}</span>
                </div>

                <div className="realisation-detail__item">
                    <span className="realisation-detail__label">Montant</span>
                    <span className="realisation-detail__value">{formatMontant(realisation.montant)}</span>
                </div>

                {(realisation.latitude || realisation.longitude) && (
                    <div className="realisation-detail__item">
                        <span className="realisation-detail__label">Coordonnées</span>
                        <span className="realisation-detail__value">
                            {realisation.latitude}, {realisation.longitude}
                        </span>
                    </div>
                )}
            </div>

            {realisation.description && (
                <div className="realisation-detail__description">
                    <span className="realisation-detail__label">Description</span>
                    <p>{realisation.description}</p>
                </div>
            )}
        </div>
    );
}

export default RealisationDetail;