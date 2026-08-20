import { useState } from "react";
import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";

const categorieService = createCrudService("categories-actualites");

const categorieFields = [
    {
        name: "categorie", // ✅ Correspond au backend
        label: "Catégorie",
        type: "text",
        required: true,
        placeholder: "Ex: Éducation"
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        placeholder: "Description de la catégorie..."
    }
];

function CategorieActualiteForm({ categorie, onSuccess, onCancel }) {
    const isEdit = Boolean(categorie);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");

    // ✅ On utilise "categorie" partout, pas "nom"
    const initialValues = isEdit
        ? {
            categorie: categorie.categorie, // <-- Le champ s'appelle "categorie" dans l'objet reçu du backend
            description: categorie.description || ""
          }
        : {};

    const handleSubmit = async (values) => {
        setLoading(true);
        setPageError("");

        // ✅ On envoie "categorie" dans le payload, pas "nom"
        const payload = {
            categorie: values.categorie, // <-- C'est ici que se trouvait l'erreur !
            description: values.description || null
        };

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

export default CategorieActualiteForm;