import { useState } from "react";
import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";

const auteurService = createCrudService("auteurs");

const auteurFields = [
    {
        name: "nom",
        label: "Nom",
        type: "text",
        required: true,
        placeholder: "Ex: Jean Dupont"
    },
    {
        name: "fonction",
        label: "Fonction",
        type: "text",
        required: false,
        placeholder: "Ex: Journaliste"
    }
];

function AuteurForm({ auteur, onSuccess, onCancel }) {
    const isEdit = Boolean(auteur);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    const initialValues = isEdit
        ? {
            nom: auteur.nom,
            fonction: auteur.fonction || ""
          }
        : {};

    const handleSubmit = async (values) => {
        setLoading(true);
        setPageError("");

        const payload = {
            nom: values.nom,
            fonction: values.fonction || null
        };

        try {
            if (isEdit) {
                await auteurService.update(auteur.id, payload);
            } else {
                await auteurService.create(payload);
            }
            onSuccess();
        } catch (err) {
            setPageError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {pageError && <p className="form-page__error">{pageError}</p>}

            <DynamicForm
                fields={auteurFields}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={loading}
                submitLabel={isEdit ? "Modifier" : "Créer"}
            />

            <button type="button" className="form-page__cancel" onClick={onCancel}>
                Annuler
            </button>
        </div>
    );
}

export default AuteurForm;