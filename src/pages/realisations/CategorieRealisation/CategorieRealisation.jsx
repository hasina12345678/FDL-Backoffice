// pages/realisations/CategorieRealisation/CategorieRealisation.jsx
import { useEffect, useState } from "react";

import CategorieRealisationForm from "./CategorieRealisationForm";
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";

import "../../../styles/ListPage.css";

const categorieService = createCrudService("categories-realisations");

function CategorieRealisation() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingCategorie, setEditingCategorie] = useState(null); // null = création

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await categorieService.findAll();
            setCategories(data);
        } catch (err) {
            setError("Impossible de charger les catégories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const openCreate = () => {
        setEditingCategorie(null);
        setShowForm(true);
    };

    const openEdit = (categorie) => {
        setEditingCategorie(categorie);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCategorie(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadCategories();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette catégorie ?")) return;
        try {
            await categorieService.remove(id);
            loadCategories();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="list-page">
            <div className="list-page__header">
                <h1>Catégories de réalisation</h1>
                <button className="list-page__add-btn" onClick={openCreate}>
                    + Ajouter une catégorie
                </button>
            </div>

            {error && <p className="form-page__error">{error}</p>}

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <table className="list-page__table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((categorie) => (
                            <tr key={categorie.id}>
                                <td>{categorie.name}</td>
                                <td className="list-page__actions">
                                    <button onClick={() => openEdit(categorie)}>Modifier</button>
                                    <button
                                        className="list-page__delete"
                                        onClick={() => handleDelete(categorie.id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showForm && (
                <Modal
                    title={editingCategorie ? "Modifier la catégorie" : "Nouvelle catégorie"}
                    onClose={closeForm}
                >
                    <CategorieRealisationForm
                        categorie={editingCategorie}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}
        </div>
    );
}

export default CategorieRealisation;