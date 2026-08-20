// pages/actualites/Actualite/ActualiteForm.jsx
import { useEffect, useState } from "react";
import createCrudService from "../../../services/api/genericService";
import { uploadMedia } from "../../../services/api/mediaUploadService";
import DetailBlock from "../../../components/ActualiteForm/DetailBlock";
import "./ActualiteForm.css";

const actualiteService = createCrudService("actualites");
const categorieService = createCrudService("categories");
const auteurService = createCrudService("auteurs");

const emptyDetailBlock = () => ({
    tempId: crypto.randomUUID(),
    subtitle: "",
    paragraphe: "",
    photos: [],
    videos: [],
    documents: [],
});

function ActualiteForm({ actualite, onSuccess, onCancel }) {
    const isEdit = Boolean(actualite);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    const [categories, setCategories] = useState([]);
    const [auteurs, setAuteurs] = useState([]);

    const [title, setTitle] = useState(actualite?.title || "");
    const [summary, setSummary] = useState(actualite?.summary || "");
    const [location, setLocation] = useState(actualite?.location || "");
    const [auteurId, setAuteurId] = useState(actualite?.auteurId || "");
    const [categorieIds, setCategorieIds] = useState(actualite?.categorieIds || []);

    const [cover, setCover] = useState(actualite?.cover || "");
    const [coverUploading, setCoverUploading] = useState(false);
    const [coverError, setCoverError] = useState("");

    const [details, setDetails] = useState(
        actualite?.details?.length
            ? actualite.details.map((d) => ({
                  tempId: crypto.randomUUID(),
                  subtitle: d.subtitle || "",
                  paragraphe: d.paragraphe || "",
                  photos: (d.photos || []).map((p) => ({ tempId: crypto.randomUUID(), ...p })),
                  videos: (d.videos || []).map((v) => ({ tempId: crypto.randomUUID(), ...v })),
                  documents: (d.documents || []).map((doc) => ({ tempId: crypto.randomUUID(), ...doc })),
              }))
            : [emptyDetailBlock()]
    );

    useEffect(() => {
        categorieService.findAll().then(setCategories).catch(() => setCategories([]));
        auteurService.findAll().then(setAuteurs).catch(() => setAuteurs([]));
    }, []);

    const handleCoverUpload = async (file) => {
        if (!file) return;
        setCoverUploading(true);
        setCoverError("");
        try {
            const result = await uploadMedia(file);
            setCover(result.url);
        } catch (err) {
            setCoverError(err.message);
        } finally {
            setCoverUploading(false);
        }
    };

    const toggleCategorie = (id) => {
        setCategorieIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const addDetailBlock = () => setDetails((prev) => [...prev, emptyDetailBlock()]);

    const updateDetailBlock = (index, updated) => {
        setDetails((prev) => prev.map((d, i) => (i === index ? updated : d)));
    };

    const removeDetailBlock = (index) => {
        setDetails((prev) => prev.filter((_, i) => i !== index));
    };

    const stripMediaForPayload = (items) =>
        items.map((i, idx) => ({ url: i.url, description: i.description || null, ordre: idx + 1 }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPageError("");

        if (!title.trim()) {
            setPageError("Le titre est requis.");
            return;
        }

        const payload = {
            title,
            summary: summary || null,
            location: location || null,
            cover: cover || null,
            auteurId: auteurId || null, // explicitement null si aucun auteur choisi
            categorieIds,
            details: details.map((d) => ({
                subtitle: d.subtitle || null,
                paragraphe: d.paragraphe || null,
                photos: stripMediaForPayload(d.photos),
                videos: stripMediaForPayload(d.videos),
                documents: stripMediaForPayload(d.documents),
            })),
        };

        setLoading(true);
        try {
            if (isEdit) {
                await actualiteService.update(actualite.id, payload);
            } else {
                await actualiteService.create(payload);
            }
            onSuccess();
        } catch (err) {
            setPageError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="actualite-form" onSubmit={handleSubmit}>
            {pageError && <p className="actualite-form__error">{pageError}</p>}

            {/* ===== INFOS PRINCIPALES ===== */}
            <section className="actualite-form__section">
                <h3 className="actualite-form__section-title">
                    <svg className="actualite-form__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 11v5M12 8h.01" />
                    </svg>
                    Informations générales
                </h3>

                <div className="actualite-form__field">
                    <label>Titre *</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'actualité" />
                </div>

                <div className="actualite-form__field">
                    <label>Résumé</label>
                    <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Court résumé affiché dans la liste" />
                </div>

                <div className="actualite-form__row">
                    <div className="actualite-form__field">
                        <label>Lieu</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Antananarivo" />
                    </div>

                    <div className="actualite-form__field">
                        <label>Auteur</label>
                        <select value={auteurId} onChange={(e) => setAuteurId(e.target.value)}>
                            <option value="">Aucun auteur</option>
                            {auteurs.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.prenom ? `${a.prenom} ${a.nom}` : a.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="actualite-form__field">
                    <label>Image de couverture</label>
                    <div className="actualite-form__cover">
                        {cover && <img src={cover} alt="Couverture" className="actualite-form__cover-preview" />}
                        <label className="actualite-form__cover-btn">
                            <svg className="actualite-form__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M4 5h16v14H4z" />
                                <circle cx="8" cy="9" r="1.5" />
                                <path d="m4 16 4-4 3 3 2-2 7 5" />
                            </svg>
                            {coverUploading ? "Envoi..." : cover ? "Changer l'image" : "Choisir une image"}
                            <input type="file" accept="image/*" hidden disabled={coverUploading} onChange={(e) => handleCoverUpload(e.target.files[0])} />
                        </label>
                        {coverError && <span className="actualite-form__error-inline">{coverError}</span>}
                    </div>
                </div>
            </section>

            {/* ===== CATÉGORIES ===== */}
            <section className="actualite-form__section">
                <h3 className="actualite-form__section-title">
                    <svg className="actualite-form__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M20 12 12 20 4 12V4h8z" />
                        <circle cx="8" cy="8" r="1" />
                    </svg>
                    Catégories
                </h3>
                <div className="actualite-form__categories">
                    {categories.map((c) => (
                        <label key={c.id} className={`actualite-form__categorie-chip ${categorieIds.includes(c.id) ? "is-active" : ""}`}>
                            <input
                                type="checkbox"
                                checked={categorieIds.includes(c.id)}
                                onChange={() => toggleCategorie(c.id)}
                                hidden
                            />
                            {c.categorie}
                        </label>
                    ))}
                </div>
            </section>

            {/* ===== SECTIONS DE DÉTAIL ===== */}
            <section className="actualite-form__section">
                <div className="actualite-form__section-header">
                    <h3 className="actualite-form__section-title">
                        <svg className="actualite-form__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M4 5h16M4 12h16M4 19h10" />
                        </svg>
                        Contenu détaillé
                    </h3>
                    <button type="button" className="actualite-form__add-block" onClick={addDetailBlock}>
                        <svg className="actualite-form__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Ajouter une section
                    </button>
                </div>

                {details.map((block, index) => (
                    <DetailBlock
                        key={block.tempId}
                        block={block}
                        index={index}
                        onChange={(updated) => updateDetailBlock(index, updated)}
                        onRemove={() => removeDetailBlock(index)}
                    />
                ))}
            </section>

            <div className="actualite-form__footer">
                <button type="button" className="actualite-form__cancel" onClick={onCancel}>
                    Annuler
                </button>
                <button type="submit" className="actualite-form__submit" disabled={loading}>
                    {loading ? "Enregistrement..." : isEdit ? "Modifier" : "Créer l'actualité"}
                </button>
            </div>
        </form>
    );
}

export default ActualiteForm;