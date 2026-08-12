// pages/realisations/SourceFinancement/SourceFinancementForm.jsx
import { useState } from "react";

import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";

const sourceFinancementService = createCrudService("sources-financement");

const sourceFinancementFields = [
    { name: "name", label: "Nom", type: "text", required: true, placeholder: "Ex: Banque Mondiale" },
    { name: "description", label: "Description", type: "textarea", rows: 4, placeholder: "Description de la source de financement..." },
];

function SourceFinancementForm({ source, onSuccess, onCancel }) {
    const isEdit = Boolean(source);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    const initialValues = isEdit
        ? { name: source.name, description: source.description || "" }
        : {};

    const handleSubmit = async (values) => {
        setLoading(true);
        setPageError("");

        const payload = {
            name: values.name,
            description: values.description,
        };

        try {
            if (isEdit) {
                await sourceFinancementService.update(source.id, payload);
            } else {
                await sourceFinancementService.create(payload);
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
                fields={sourceFinancementFields}
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

export default SourceFinancementForm;