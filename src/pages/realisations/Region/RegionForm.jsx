// pages/realisations/Region/RegionForm.jsx
import { useState } from "react";

import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";

const regionService = createCrudService("regions");

const regionFields = [
    { name: "name", label: "Nom", type: "text", required: true, placeholder: "Ex: Analamanga" },
    { name: "code", label: "Code", type: "text", required: true, placeholder: "Ex: ANA" },
];

function RegionForm({ region, onSuccess, onCancel }) {
    const isEdit = Boolean(region);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    const initialValues = isEdit
        ? { name: region.name, code: region.code }
        : {};

    const handleSubmit = async (values) => {
        setLoading(true);
        setPageError("");

        const payload = { name: values.name, code: values.code };

        try {
            if (isEdit) {
                await regionService.update(region.id, payload);
            } else {
                await regionService.create(payload);
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
                fields={regionFields}
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

export default RegionForm;