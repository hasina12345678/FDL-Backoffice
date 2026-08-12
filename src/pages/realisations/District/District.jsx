// pages/realisations/District/District.jsx
import { useEffect, useState } from "react";

import DistrictForm from "./DistrictForm";
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";

import "../../../styles/ListPage.css";

const districtService = createCrudService("districts");

function District() {
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState(null); // null = création

    const loadDistricts = async () => {
        setLoading(true);
        try {
            const data = await districtService.findAll();
            setDistricts(data);
        } catch (err) {
            setError("Impossible de charger les districts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDistricts();
    }, []);

    const openCreate = () => {
        setEditingDistrict(null);
        setShowForm(true);
    };

    const openEdit = (district) => {
        setEditingDistrict(district);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingDistrict(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadDistricts();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce district ?")) return;
        try {
            await districtService.remove(id);
            loadDistricts();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="list-page">
            <div className="list-page__header">
                <h1>Districts</h1>
                <button className="list-page__add-btn" onClick={openCreate}>
                    + Ajouter un district
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
                            <th>Région</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {districts.map((district) => (
                            <tr key={district.id}>
                                <td>{district.name}</td>
                                <td>{district.code}</td>
                                <td>{district.regionName}</td>
                                <td className="list-page__actions">
                                    <button onClick={() => openEdit(district)}>Modifier</button>
                                    <button
                                        className="list-page__delete"
                                        onClick={() => handleDelete(district.id)}
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
                    title={editingDistrict ? "Modifier le district" : "Nouveau district"}
                    onClose={closeForm}
                >
                    <DistrictForm
                        district={editingDistrict}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}
        </div>
    );
}

export default District;    