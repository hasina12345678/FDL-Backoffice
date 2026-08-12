// pages/realisations/CategorieRealisation/CategorieRealisationForm.jsx
import { useState } from "react";

import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";

const categorieService = createCrudService("categories-realisations");

const categorieFields = [
    { name: "name", label: "Nom", type: "text", required: true, placeholder: "Ex: Infrastructure" },
];

function CategorieRealisationForm({ categorie, onSuccess, onCancel }) {
    const isEdit = Boolean(categorie);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    const initialValues = isEdit
        ? { name: categorie.name }
        : {};

    const handleSubmit = async (values) => {
        setLoading(true);
        setPageError("");

        const payload = { name: values.name };

        try {
            if (isEdit) {
                await categorieService.update(categorie.id, payload);
            } else {
                await categorieService.create(payload);
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
                fields={categorieFields}
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

export default CategorieRealisationForm;