// pages/realisations/Commune/CommuneForm.jsx
import { useState } from "react";

import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";
import { API_URL } from "../../../services/api/config";

const communeService = createCrudService("communes");

const communeFields = [
    { name: "name", label: "Nom", type: "text", required: true, placeholder: "Ex: Antananarivo Renivohitra" },
    {
        name: "regionId",
        label: "Région",
        type: "select",
        required: true,
        placeholder: "Sélectionner une région...",
        optionsSource: {
            url: `${API_URL}/regions`,
            valueKey: "id",
            labelKey: "name",
        },
    },
    {
        name: "districtId",
        label: "District",
        type: "select",
        required: true,
        placeholder: "Sélectionner un district...",
        dependsOnMessage: "Sélectionnez d'abord une région",
        optionsSource: {
            dependsOn: "regionId",
            url: (values) => `${API_URL}/regions/${values.regionId}/districts`,
            valueKey: "id",
            labelKey: "name",
        },
    },
];

function CommuneForm({ commune, onSuccess, onCancel }) {
    const isEdit = Boolean(commune);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    // regionId n'existe pas dans CommuneDTO, on doit le déduire du district
    // -> géré en amont dans Commune.jsx qui passe déjà commune.regionId (voir plus bas)
    const initialValues = isEdit
        ? {
              name: commune.name,
              regionId: commune.regionId,
              districtId: commune.districtId,
          }
        : {};

    const handleSubmit = async (values) => {
        setLoading(true);
        setPageError("");

        // CommuneCtrl attend un CommuneDTO plat : name + districtId
        const payload = {
            name: values.name,
            districtId: values.districtId,
        };

        try {
            if (isEdit) {
                await communeService.update(commune.id, payload);
            } else {
                await communeService.create(payload);
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
                fields={communeFields}
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

export default CommuneForm;