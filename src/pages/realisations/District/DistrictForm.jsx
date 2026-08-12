// pages/realisations/District/DistrictForm.jsx
import { useState } from "react";

import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";

const districtService = createCrudService("districts");

const districtFields = [
    { name: "name", label: "Nom", type: "text", required: true, placeholder: "Ex: Antananarivo Avaradrano" },
    { name: "code", label: "Code", type: "text", required: true, placeholder: "Ex: ATA" },
    {
        name: "regionId",
        label: "Région",
        type: "select",
        required: true,
        placeholder: "Sélectionner une région...",
        optionsSource: {
            url: "http://localhost:8080/api/regions",
            valueKey: "id",
            labelKey: "name",
        },
    },
];

function DistrictForm({ district, onSuccess, onCancel }) {
    const isEdit = Boolean(district);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    const initialValues = isEdit
        ? {
              name: district.name,
              code: district.code,
              regionId: district.regionId,
          }
        : {};

    const handleSubmit = async (values) => {
        setLoading(true);
        setPageError("");

        // DistrictCtrl attend l'entité District avec region imbriquée
        const payload = {
            name: values.name,
            code: values.code,
            region: { id: values.regionId },
        };

        try {
            if (isEdit) {
                await districtService.update(district.id, payload);
            } else {
                await districtService.create(payload);
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
                fields={districtFields}
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

export default DistrictForm;