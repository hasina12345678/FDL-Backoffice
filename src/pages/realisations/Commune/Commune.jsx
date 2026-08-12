// pages/realisations/Commune/Commune.jsx
import { useEffect, useState } from "react";

import CommuneForm from "./CommuneForm";
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";

import "../../../styles/ListPage.css";

const communeService = createCrudService("communes");
const districtService = createCrudService("districts");

function Commune() {
    const [communes, setCommunes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingCommune, setEditingCommune] = useState(null); // null = création
    const [resolvingEdit, setResolvingEdit] = useState(false);

    const loadCommunes = async () => {
        setLoading(true);
        try {
            const data = await communeService.findAll();
            setCommunes(data);
        } catch (err) {
            setError("Impossible de charger les communes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCommunes();
    }, []);

    const openCreate = () => {
        setEditingCommune(null);
        setShowForm(true);
    };

    const openEdit = async (commune) => {
        setResolvingEdit(true);
        try {
            // On retrouve la région du district pour pré-remplir le select cascade
            const district = await districtService.findById(commune.districtId);
            setEditingCommune({
                ...commune,
                regionId: district.regionId,
            });
            setShowForm(true);
        } catch (err) {
            alert("Impossible de charger les détails de cette commune.");
        } finally {
            setResolvingEdit(false);
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCommune(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadCommunes();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette commune ?")) return;
        try {
            await communeService.remove(id);
            loadCommunes();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="list-page">
            <div className="list-page__header">
                <h1>Communes</h1>
                <button className="list-page__add-btn" onClick={openCreate}>
                    + Ajouter une commune
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
                            <th>District</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {communes.map((commune) => (
                            <tr key={commune.id}>
                                <td>{commune.name}</td>
                                <td>{commune.districtName}</td>
                                <td className="list-page__actions">
                                    <button
                                        disabled={resolvingEdit}
                                        onClick={() => openEdit(commune)}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="list-page__delete"
                                        onClick={() => handleDelete(commune.id)}
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
                    title={editingCommune ? "Modifier la commune" : "Nouvelle commune"}
                    onClose={closeForm}
                >
                    <CommuneForm
                        commune={editingCommune}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Commune;