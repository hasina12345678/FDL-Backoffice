import { useEffect, useState } from "react";
import AuteurForm from "./AuteurForm";
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";
import "../../../styles/ListPage.css";

const auteurService = createCrudService("auteurs");

function Auteur() {
    const [auteurs, setAuteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingAuteur, setEditingAuteur] = useState(null);

    const loadAuteurs = async () => {
        setLoading(true);
        try {
            const data = await auteurService.findAll();
            setAuteurs(data);
        } catch (err) {
            setError("Impossible de charger les auteurs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuteurs();
    }, []);

    const openCreate = () => {
        setEditingAuteur(null);
        setShowForm(true);
    };

    const openEdit = (auteur) => {
        setEditingAuteur(auteur);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingAuteur(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadAuteurs();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cet auteur ?")) return;
        try {
            await auteurService.remove(id);
            loadAuteurs();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="list-page">
            <div className="list-page__header">
                <h1>Auteurs</h1>
                <button className="list-page__add-btn" onClick={openCreate}>
                    + Ajouter un auteur
                </button>
            </div>

            {error && <p className="form-page__error">{error}</p>}

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <table className="list-page__table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Fonction</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auteurs.map((auteur) => (
                            <tr key={auteur.id}>
                                <td>{auteur.id}</td>
                                <td>{auteur.nom}</td>
                                <td>{auteur.fonction}</td>
                                <td className="list-page__actions">
                                    <button onClick={() => openEdit(auteur)}>
                                        Modifier
                                    </button>
                                    <button
                                        className="list-page__delete"
                                        onClick={() => handleDelete(auteur.id)}
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
                    title={editingAuteur ? "Modifier l'auteur" : "Nouvel auteur"}
                    onClose={closeForm}
                >
                    <AuteurForm
                        auteur={editingAuteur}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Auteur;