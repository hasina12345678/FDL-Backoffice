// pages/realisations/Realisation/Realisation.jsx
import { useEffect, useMemo, useState } from "react";

import RealisationForm from "./RealisationForm";
import RealisationCard from "../../../components/RealisationCard/RealisationCard";
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";

import RealisationDetail from "../../../components/RealisationDetail/RealisationDetail";

import "./Realisation.css";

const realisationService = createCrudService("realisations");
const categorieService = createCrudService("categories-realisations");
const programmeService = createCrudService("programmes");
const communeService = createCrudService("communes");
const districtService = createCrudService("districts");

const initialFilters = {
    search: "",
    categorieId: "",
    programmeId: "",
    annee: "",
};

function Realisation() {
    const [realisations, setRealisations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [programmes, setProgrammes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState(initialFilters);

    const [showForm, setShowForm] = useState(false);
    const [editingRealisation, setEditingRealisation] = useState(null);
    const [resolvingEdit, setResolvingEdit] = useState(false);

    const [showDetail, setShowDetail] = useState(false);
    const [viewingRealisation, setViewingRealisation] = useState(null);

    const openDetail = (realisation) => {
        setViewingRealisation(realisation);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setViewingRealisation(null);
    };

    // Pour passer de la vue détail à l'édition directement
    const editFromDetail = () => {
        const toEdit = viewingRealisation;
        closeDetail();
        openEdit(toEdit);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [realisationsData, categoriesData, programmesData] = await Promise.all([
                realisationService.findAll(),
                categorieService.findAll(),
                programmeService.findAll(),
            ]);
            setRealisations(realisationsData);
            setCategories(categoriesData);
            setProgrammes(programmesData);
        } catch (err) {
            setError("Impossible de charger les réalisations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const years = useMemo(() => {
        const unique = new Set(
            realisations.map((r) => r.annee).filter((a) => a !== null && a !== undefined)
        );
        return Array.from(unique).sort((a, b) => b - a);
    }, [realisations]);

    const filteredRealisations = useMemo(() => {
        return realisations.filter((r) => {
            const matchesSearch =
                !filters.search ||
                r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                (r.communeName || "").toLowerCase().includes(filters.search.toLowerCase());

            const matchesCategorie =
                !filters.categorieId || String(r.categorieId) === String(filters.categorieId);

            const matchesProgramme =
                !filters.programmeId || String(r.programmeId) === String(filters.programmeId);

            const matchesAnnee =
                !filters.annee || String(r.annee) === String(filters.annee);

            return matchesSearch && matchesCategorie && matchesProgramme && matchesAnnee;
        });
    }, [realisations, filters]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    const openCreate = () => {
        setEditingRealisation(null);
        setShowForm(true);
    };

    const openEdit = async (realisation) => {
        setResolvingEdit(true);
        try {
            const commune = await communeService.findById(realisation.communeId);
            const district = await districtService.findById(commune.districtId);

            setEditingRealisation({
                ...realisation,
                districtId: commune.districtId,
                regionId: district.regionId,
            });
            setShowForm(true);
        } catch (err) {
            alert("Impossible de charger les détails de cette réalisation.");
        } finally {
            setResolvingEdit(false);
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingRealisation(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadData();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette réalisation ?")) return;
        try {
            await realisationService.remove(id);
            loadData();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="realisation-page">
            <div className="realisation-page__header">
                <h1>Réalisations</h1>
                <button className="realisation-page__add-btn" onClick={openCreate}>
                    + Ajouter une réalisation
                </button>
            </div>

            {/* ---------- Filtres ---------- */}
            <div className="realisation-filters">
                <div className="realisation-filters__group">
                    <label>Recherche</label>
                    <input
                        type="text"
                        placeholder="Titre ou commune..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </div>

                <div className="realisation-filters__group">
                    <label>Catégorie</label>
                    <select
                        value={filters.categorieId}
                        onChange={(e) => handleFilterChange("categorieId", e.target.value)}
                    >
                        <option value="">Toutes</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="realisation-filters__group">
                    <label>Programme</label>
                    <select
                        value={filters.programmeId}
                        onChange={(e) => handleFilterChange("programmeId", e.target.value)}
                    >
                        <option value="">Tous</option>
                        {programmes.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="realisation-filters__group">
                    <label>Année</label>
                    <select
                        value={filters.annee}
                        onChange={(e) => handleFilterChange("annee", e.target.value)}
                    >
                        <option value="">Toutes</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <button className="realisation-filters__reset" onClick={resetFilters}>
                    Réinitialiser
                </button>
            </div>

            {error && <p className="form-page__error">{error}</p>}

            {/* ---------- Liste en cards ---------- */}
            {loading ? (
                <p>Chargement...</p>
            ) : filteredRealisations.length === 0 ? (
                <p className="realisation-page__empty">Aucune réalisation ne correspond à ces critères.</p>
            ) : (
                <div className="realisation-grid">
                    {filteredRealisations.map((r) => (
                        <RealisationCard
                            key={r.id}
                            realisation={r}
                            onView={openDetail}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {resolvingEdit && <p className="realisation-page__loading-edit">Chargement des détails...</p>}

            {showForm && (
                <Modal
                    title={editingRealisation ? "Modifier la réalisation" : "Nouvelle réalisation"}
                    onClose={closeForm}
                >
                    <RealisationForm
                        realisation={editingRealisation}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}

            {showDetail && viewingRealisation && (
                <Modal title="Détails de la réalisation" onClose={closeDetail}>
                    <RealisationDetail realisation={viewingRealisation} />
                    <div className="realisation-detail__modal-actions">
                        <button className="form-page__modif_realisation" onClick={editFromDetail}>
                            Modifier cette réalisation
                        </button>
                    </div>
                </Modal>
            )}

        </div>
    );
}

export default Realisation;