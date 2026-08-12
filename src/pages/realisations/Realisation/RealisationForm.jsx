// pages/realisations/Realisation/RealisationForm.jsx
import { useState } from "react";

import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";

const realisationService = createCrudService("realisations");

const realisationFields = [
    { name: "title", label: "Titre", type: "text", required: true, placeholder: "Ex: Construction d'un pont" },
    { name: "summary", label: "Résumé", type: "text", placeholder: "Résumé court" },
    { name: "description", label: "Description", type: "textarea", rows: 4, placeholder: "Description détaillée..." },

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
    {
        name: "districtId",
        label: "District",
        type: "select",
        required: true,
        placeholder: "Sélectionner un district...",
        dependsOnMessage: "Sélectionnez d'abord une région",
        optionsSource: {
            dependsOn: "regionId",
            url: (values) => `http://localhost:8080/api/regions/${values.regionId}/districts`,
            valueKey: "id",
            labelKey: "name",
        },
    },
    {
        name: "communeId",
        label: "Commune",
        type: "select",
        required: true,
        placeholder: "Sélectionner une commune...",
        dependsOnMessage: "Sélectionnez d'abord un district",
        optionsSource: {
            dependsOn: "districtId",
            url: (values) => `http://localhost:8080/api/districts/${values.districtId}/communes`,
            valueKey: "id",
            labelKey: "name",
        },
    },

    {
        name: "categorieId",
        label: "Catégorie",
        type: "select",
        placeholder: "Sélectionner une catégorie...",
        optionsSource: {
            url: "http://localhost:8080/api/categories-realisations",
            valueKey: "id",
            labelKey: "name",
        },
    },
    {
        name: "programmeId",
        label: "Programme",
        type: "select",
        placeholder: "Sélectionner un programme...",
        optionsSource: {
            url: "http://localhost:8080/api/programmes",
            valueKey: "id",
            labelKey: "name",
        },
    },
    {
        name: "sourceFinancementId",
        label: "Source de financement",
        type: "select",
        placeholder: "Sélectionner une source...",
        optionsSource: {
            url: "http://localhost:8080/api/sources-financement",
            valueKey: "id",
            labelKey: "name",
        },
    },

    { name: "annee", label: "Année", type: "number", placeholder: "Ex: 2025" },
    { name: "dateRealisation", label: "Date de réalisation", type: "date" },
    { name: "montant", label: "Montant (Ar)", type: "number", step: "0.01", placeholder: "Ex: 15000000" },
    { name: "latitude", label: "Latitude", type: "number", step: "0.0000001", placeholder: "Ex: -18.8792" },
    { name: "longitude", label: "Longitude", type: "number", step: "0.0000001", placeholder: "Ex: 47.5079" },
    { name: "photo", label: "Photo", type: "file", accept: "image/*" },
];

function RealisationForm({ realisation, onSuccess, onCancel }) {
    const isEdit = Boolean(realisation);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    // realisation contient déjà regionId/districtId résolus en amont (voir Realisation.jsx)
    const initialValues = isEdit
        ? {
              title: realisation.title,
              summary: realisation.summary || "",
              description: realisation.description || "",
              regionId: realisation.regionId,
              districtId: realisation.districtId,
              communeId: realisation.communeId,
              categorieId: realisation.categorieId || "",
              programmeId: realisation.programmeId || "",
              sourceFinancementId: realisation.sourceFinancementId || "",
              annee: realisation.annee || "",
              dateRealisation: realisation.dateRealisation || "",
              montant: realisation.montant || "",
              latitude: realisation.latitude || "",
              longitude: realisation.longitude || "",
              photo: realisation.photo || "",
          }
        : {};

    const handleSubmit = async (values) => {
        setLoading(true);
        setPageError("");

        // RealisationDTO attend un payload plat avec les ids
        const payload = {
            title: values.title,
            summary: values.summary || null,
            description: values.description || null,
            communeId: values.communeId,
            categorieId: values.categorieId || null,
            programmeId: values.programmeId || null,
            sourceFinancementId: values.sourceFinancementId || null,
            annee: values.annee ? Number(values.annee) : null,
            dateRealisation: values.dateRealisation || null,
            montant: values.montant ? Number(values.montant) : null,
            latitude: values.latitude ? Number(values.latitude) : null,
            longitude: values.longitude ? Number(values.longitude) : null,
            photo: values.photo || null,
        };

        try {
            if (isEdit) {
                await realisationService.update(realisation.id, payload);
            } else {
                await realisationService.create(payload);
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
                fields={realisationFields}
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

export default RealisationForm;