import { useEffect, useState } from "react";

import ProgrammeForm from "./ProgrammeForm";
import Modal from "../../../components/Modal/Modal";
import createCrudService from "../../../services/api/genericService";

import "../../../styles/ListPage.css";

const programmeService = createCrudService("programmes");

function Programme() {

    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingProgramme, setEditingProgramme] = useState(null);

    const loadProgrammes = async () => {

        setLoading(true);

        try {
            const data = await programmeService.findAll();
            setProgrammes(data);

        } catch (err) {
            setError("Impossible de charger les programmes.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProgrammes();
    }, []);

    const openCreate = () => {
        setEditingProgramme(null);
        setShowForm(true);
    };

    const openEdit = (programme) => {
        setEditingProgramme(programme);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingProgramme(null);
    };

    const handleSuccess = () => {
        closeForm();
        loadProgrammes();
    };

    const handleDelete = async (id) => {

        if(!window.confirm("Supprimer ce programme ?")) return;
        try {
            await programmeService.remove(id);
            loadProgrammes();

        } catch(err){
            alert("Erreur lors de la suppression.");
        }
    };


    return (
        <div className="list-page">
            <div className="list-page__header">
                <h1>Programmes</h1>
                <button
                    className="list-page__add-btn"
                    onClick={openCreate}
                >
                    + Ajouter un programme
                </button>
            </div>

            {error && (
                <p className="form-page__error">
                    {error}
                </p>
            )}

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <table className="list-page__table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {programmes.map((programme)=>(
                            <tr key={programme.id}>
                                <td>
                                    {programme.code}
                                </td>
                                <td>
                                    {programme.name}
                                </td>
                                <td>
                                    {programme.description}
                                </td>
                                <td className="list-page__actions">
                                    <button
                                        onClick={() => openEdit(programme)}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="list-page__delete"
                                        onClick={() => handleDelete(programme.id)}
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
                    title={
                        editingProgramme
                        ? "Modifier le programme"
                        : "Nouveau programme"
                    }
                    onClose={closeForm}
                >
                    <ProgrammeForm
                        programme={editingProgramme}
                        onSuccess={handleSuccess}
                        onCancel={closeForm}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Programme;