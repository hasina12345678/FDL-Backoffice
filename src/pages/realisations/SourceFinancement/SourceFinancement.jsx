// pages/realisations/SourceFinancement/SourceFinancement.jsx
import { useEffect, useState } from "react";

import SourceFinancementForm from "./SourceFinancementForm";
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";

import "../../../styles/ListPage.css";

const sourceFinancementService = createCrudService("sources-financement");

function SourceFinancement() {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingSource, setEditingSource] = useState(null); // null = création

    const loadSources = async () => {
        setLoading(true);
        try {
            const data = await sourceFinancementService.findAll();
            setSources(data);
        } catch (err) {
            setError("Impossible de charger les sources de financement.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSources();
    }, []);

    const openCreate = () => {
        setEditingSource(null);
        setShowForm(true);
    };

    const openEdit = (source) => {
        setEditingSource(source);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingSource(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadSources();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette source de financement ?")) return;
        try {
            await sourceFinancementService.remove(id);
            loadSources();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="list-page">
            <div className="list-page__header">
                <h1>Sources de financement</h1>
                <button className="list-page__add-btn" onClick={openCreate}>
                    + Ajouter une source
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
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sources.map((source) => (
                            <tr key={source.id}>
                                <td>{source.name}</td>
                                <td>{source.description}</td>
                                <td className="list-page__actions">
                                    <button onClick={() => openEdit(source)}>Modifier</button>
                                    <button
                                        className="list-page__delete"
                                        onClick={() => handleDelete(source.id)}
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
                    title={editingSource ? "Modifier la source" : "Nouvelle source de financement"}
                    onClose={closeForm}
                >
                    <SourceFinancementForm
                        source={editingSource}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}
        </div>
    );
}

export default SourceFinancement;