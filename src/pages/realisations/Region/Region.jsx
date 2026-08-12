// pages/realisations/Region/Region.jsx
import { useEffect, useState } from "react";

import RegionForm from "./RegionForm";
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";

import "../../../styles/ListPage.css";

const regionService = createCrudService("regions");

function Region() {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingRegion, setEditingRegion] = useState(null); 

    const loadRegions = async () => {
        setLoading(true);
        try {
            const data = await regionService.findAll();
            setRegions(data);
        } catch (err) {
            setError("Impossible de charger les régions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRegions();
    }, []);

    const openCreate = () => {
        setEditingRegion(null);
        setShowForm(true);
    };

    const openEdit = (region) => {
        setEditingRegion(region);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingRegion(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadRegions();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette région ?")) return;
        try {
            await regionService.remove(id);
            loadRegions();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="list-page">
            <div className="list-page__header">
                <h1>Régions</h1>
                <button className="list-page__add-btn" onClick={openCreate}>
                    + Ajouter une région
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
                            <th>Code</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {regions.map((region) => (
                            <tr key={region.id}>
                                <td>{region.name}</td>
                                <td>{region.code}</td>
                                <td className="list-page__actions">
                                    <button onClick={() => openEdit(region)}>Modifier</button>
                                    <button
                                        className="list-page__delete"
                                        onClick={() => handleDelete(region.id)}
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
                    title={editingRegion ? "Modifier la région" : "Nouvelle région"}
                    onClose={closeForm}
                >
                    <RegionForm
                        region={editingRegion}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Region;