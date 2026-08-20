// pages/actualites/Actualite/Actualite.jsx
import { useEffect, useMemo, useState } from "react";

import ActualiteForm from "./ActualiteForm";
import ActualiteCard from "../../../components/Actualitecard/ActualiteCard"; //
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";

import "./Actualite.css";

const actualiteService = createCrudService("actualites");
const categorieService = createCrudService("categories-actualites");

const initialFilters = {
    search: "",
    categorie: "",
    auteur: "", // "" = tous | "none" = sans auteur | "has" = avec auteur
};

function Actualite() {
    const [actualites, setActualites] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState(initialFilters);

    const [showForm, setShowForm] = useState(false);
    const [editingActualite, setEditingActualite] = useState(null);

    const [showDetail, setShowDetail] = useState(false);
    const [viewingActualite, setViewingActualite] = useState(null);
    const [resolvingDetail, setResolvingDetail] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [actualitesData, categoriesData] = await Promise.all([
                actualiteService.findAll(),
                categorieService.findAll(),
            ]);
            setActualites(actualitesData);
            setCategories(categoriesData);
        } catch (err) {
            setError("Impossible de charger les actualités.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredActualites = useMemo(() => {
        return actualites.filter((a) => {
            const matchesSearch =
                !filters.search ||
                a.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                (a.location || "").toLowerCase().includes(filters.search.toLowerCase());

            const matchesCategorie =
                !filters.categorie || (a.categories || []).includes(filters.categorie);

            const matchesAuteur =
                !filters.auteur ||
                (filters.auteur === "none" ? !a.auteurId : Boolean(a.auteurId));

            return matchesSearch && matchesCategorie && matchesAuteur;
        });
    }, [actualites, filters]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(initialFilters);

    const openCreate = () => {
        setEditingActualite(null);
        setShowForm(true);
    };

    const openEdit = async (actualiteListItem) => {
        try {
            // La liste ne contient que le DTO léger : on va chercher le
            // détail complet (sections, médias) avant d'ouvrir l'édition.
            const full = await actualiteService.findById(actualiteListItem.id);
            setEditingActualite(full);
            setShowForm(true);
        } catch (err) {
            alert("Impossible de charger les détails de cette actualité.");
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingActualite(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadData();
    };

    const openDetail = async (actualiteListItem) => {
        setResolvingDetail(true);
        try {
            const full = await actualiteService.findById(actualiteListItem.id);
            setViewingActualite(full);
            setShowDetail(true);
        } catch (err) {
            alert("Impossible de charger cette actualité.");
        } finally {
            setResolvingDetail(false);
        }
    };

    const closeDetail = () => {
        setShowDetail(false);
        setViewingActualite(null);
    };

    const editFromDetail = () => {
        const toEdit = viewingActualite;
        closeDetail();
        setEditingActualite(toEdit);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette actualité ?")) return;
        try {
            await actualiteService.remove(id);
            loadData();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="actualite-page">
            <div className="actualite-page__header">
                <h1>Actualités</h1>
                <button className="actualite-page__add-btn" onClick={openCreate}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Ajouter une actualité
                </button>
            </div>

            {/* ---------- Filtres ---------- */}
            <div className="actualite-filters">
                <div className="actualite-filters__group">
                    <label>Recherche</label>
                    <input
                        type="text"
                        placeholder="Titre ou lieu..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </div>

                <div className="actualite-filters__group">
                    <label>Catégorie</label>
                    <select
                        value={filters.categorie}
                        onChange={(e) => handleFilterChange("categorie", e.target.value)}
                    >
                        <option value="">Toutes</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.categorie}>{c.categorie}</option>
                        ))}
                    </select>
                </div>

                <div className="actualite-filters__group">
                    <label>Auteur</label>
                    <select
                        value={filters.auteur}
                        onChange={(e) => handleFilterChange("auteur", e.target.value)}
                    >
                        <option value="">Tous</option>
                        <option value="has">Avec auteur</option>
                        <option value="none">Sans auteur</option>
                    </select>
                </div>

                <button className="actualite-filters__reset" onClick={resetFilters}>
                    Réinitialiser
                </button>
            </div>

            {error && <p className="form-page__error">{error}</p>}

            {/* ---------- Liste en cards ---------- */}
            {loading ? (
                <p>Chargement...</p>
            ) : filteredActualites.length === 0 ? (
                <p className="actualite-page__empty">Aucune actualité ne correspond à ces critères.</p>
            ) : (
                <div className="actualite-grid">
                    {filteredActualites.map((a) => (
                        <ActualiteCard
                            key={a.id}
                            actualite={a}
                            onView={openDetail}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {resolvingDetail && <p className="actualite-page__loading-edit">Chargement des détails...</p>}

            {showForm && (
                <Modal
                    title={editingActualite ? "Modifier l'actualité" : "Nouvelle actualité"}
                    onClose={closeForm}
                >
                    <ActualiteForm
                        actualite={editingActualite}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}

            {showDetail && viewingActualite && (
                <Modal title="Détails de l'actualité" onClose={closeDetail}>
                    <div className="actualite-detail-view">
                        {viewingActualite.cover && (
                            <img
                                src={viewingActualite.cover}
                                alt={viewingActualite.title}
                                className="actualite-detail-view__cover"
                            />
                        )}

                        <h2 className="actualite-detail-view__title">{viewingActualite.title}</h2>

                        <div className="actualite-detail-view__meta">
                            {viewingActualite.location && (
                                <span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {viewingActualite.location}
                                </span>
                            )}
                            <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 21a8 8 0 0 1 16 0" />
                                </svg>
                                {viewingActualite.auteurNom || "Aucun auteur renseigné"}
                                {viewingActualite.auteurFonction && ` — ${viewingActualite.auteurFonction}`}
                            </span>
                        </div>

                        {viewingActualite.categories?.length > 0 && (
                            <div className="actualite-detail-view__categories">
                                {viewingActualite.categories.map((c) => (
                                    <span key={c} className="actualite-detail-view__chip">{c}</span>
                                ))}
                            </div>
                        )}

                        {viewingActualite.summary && (
                            <p className="actualite-detail-view__summary">{viewingActualite.summary}</p>
                        )}

                        {viewingActualite.details?.map((block) => (
                            <div className="actualite-detail-view__block" key={block.id}>
                                {block.subtitle && <h3>{block.subtitle}</h3>}
                                {block.paragraphe && <p>{block.paragraphe}</p>}

                                {block.photos?.length > 0 && (
                                    <div className="actualite-detail-view__photos">
                                        {block.photos.map((p) => (
                                            <img key={p.id} src={p.url} alt={p.description || ""} />
                                        ))}
                                    </div>
                                )}

                                {block.videos?.length > 0 && (
                                    <div className="actualite-detail-view__videos">
                                        {block.videos.map((v) => (
                                            <video key={v.id} src={v.url} controls />
                                        ))}
                                    </div>
                                )}

                                {block.documents?.length > 0 && (
                                    <ul className="actualite-detail-view__documents">
                                        {block.documents.map((d) => (
                                            <li key={d.id}>
                                                <a href={d.url} target="_blank" rel="noopener noreferrer">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                                        <path d="M6 3h9l4 4v14H6z" />
                                                        <path d="M14 3v5h5" />
                                                    </svg>
                                                    {d.description || "Document"}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="actualite-detail__modal-actions">
                        <button className="form-page__modif_realisation" onClick={editFromDetail}>
                            Modifier cette actualité
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default Actualite;