// components/DynamicForm/DynamicForm.jsx
import { useState, useEffect, useCallback } from "react";
import { uploadFile } from "../../services/api/uploadService";
import "./DynamicForm.css";

function DynamicForm({ fields, initialValues = {}, onSubmit, loading = false, submitLabel = "Enregistrer" }) {
    const [values, setValues] = useState(() => {
        const defaults = {};
        fields.forEach((f) => {
            defaults[f.name] = f.type === "checkbox" ? false : "";
        });
        return defaults;
    });

    const [options, setOptions] = useState({});
    const [errors, setErrors] = useState({});
    const [uploadingFields, setUploadingFields] = useState({});
    const [uploadErrors, setUploadErrors] = useState({});

    // Recharge les valeurs quand initialValues arrive (mode édition, chargement async)
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            setValues((prev) => ({ ...prev, ...initialValues }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialValues)]);

    const fetchOptions = useCallback(async (field, currentValues) => {
        const src = field.optionsSource;
        if (!src) return;

        if (src.dependsOn && !currentValues[src.dependsOn]) {
            setOptions((prev) => ({ ...prev, [field.name]: [] }));
            return;
        }

        const url = typeof src.url === "function" ? src.url(currentValues) : src.url;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(url, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!res.ok) {
                console.error(`Erreur ${res.status} chargement options pour ${field.name}`);
                setOptions((prev) => ({ ...prev, [field.name]: [] }));
                return;
            }

            const data = await res.json();
            setOptions((prev) => ({ ...prev, [field.name]: data }));
        } catch (err) {
            console.error(`Erreur chargement options pour ${field.name}`, err);
            setOptions((prev) => ({ ...prev, [field.name]: [] }));
        }
    }, []);

    // Recharge les options des selects quand leur dépendance change
    useEffect(() => {
        fields.forEach((field) => {
            if (field.type === "select" && field.optionsSource) {
                fetchOptions(field, values);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.map((f) => (f.optionsSource?.dependsOn ? values[f.optionsSource.dependsOn] : "")).join("|")]);

    const handleChange = (field, rawValue) => {
        setValues((prev) => {
            const next = { ...prev, [field.name]: rawValue };

            // Réinitialise les champs enfants (ex: districtId si regionId change)
            fields.forEach((f) => {
                if (f.optionsSource?.dependsOn === field.name) {
                    next[f.name] = "";
                }
            });

            return next;
        });

        if (errors[field.name]) {
            setErrors((prev) => ({ ...prev, [field.name]: null }));
        }
    };

    const handleFileChange = async (field, file) => {
        if (!file) return;

        setUploadingFields((prev) => ({ ...prev, [field.name]: true }));
        setUploadErrors((prev) => ({ ...prev, [field.name]: null }));

        try {
            const result = await uploadFile(file);
            handleChange(field, result.url); // on stocke l'URL renvoyée par le backend
        } catch (err) {
            setUploadErrors((prev) => ({ ...prev, [field.name]: "Échec de l'upload." }));
        } finally {
            setUploadingFields((prev) => ({ ...prev, [field.name]: false }));
        }
    };

    const validate = () => {
        const newErrors = {};
        fields.forEach((field) => {
            if (field.required && !values[field.name] && values[field.name] !== 0) {
                newErrors[field.name] = "Ce champ est requis";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(values);
    };

    const renderField = (field) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            disabled: field.disabled || loading,
        };

        switch (field.type) {
            case "textarea":
                return (
                    <textarea
                        {...commonProps}
                        placeholder={field.placeholder}
                        value={values[field.name] ?? ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        rows={field.rows || 4}
                    />
                );

            case "select": {
                const isBlockedByDependency =
                    field.optionsSource?.dependsOn && !values[field.optionsSource.dependsOn];

                const fieldOptions = field.optionsSource
                    ? options[field.name] || []
                    : field.options || [];

                const valueKey = field.optionsSource?.valueKey || "value";
                const labelKey = field.optionsSource?.labelKey || "label";

                return (
                    <select
                        {...commonProps}
                        disabled={commonProps.disabled || isBlockedByDependency}
                        value={values[field.name] ?? ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                    >
                        <option value="">
                            {isBlockedByDependency
                                ? field.dependsOnMessage || "Sélectionnez d'abord le champ parent"
                                : field.placeholder || "Sélectionner..."}
                        </option>
                        {fieldOptions.map((opt) =>
                            field.optionsSource ? (
                                <option key={opt[valueKey]} value={opt[valueKey]}>
                                    {opt[labelKey]}
                                </option>
                            ) : (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            )
                        )}
                    </select>
                );
            }

            case "checkbox":
                return (
                    <input
                        {...commonProps}
                        type="checkbox"
                        checked={!!values[field.name]}
                        onChange={(e) => handleChange(field, e.target.checked)}
                    />
                );

            case "file": {
                const isUploading = uploadingFields[field.name];
                const currentUrl = values[field.name];
                const previewUrl = currentUrl ? `http://localhost:8080${currentUrl}` : null;

                return (
                    <div className="dynamic-form__file">
                        {previewUrl && (
                            <img src={previewUrl} alt="Aperçu" className="dynamic-form__file-preview" />
                        )}

                        <input
                            {...commonProps}
                            type="file"
                            accept={field.accept || "image/*"}
                            disabled={commonProps.disabled || isUploading}
                            onChange={(e) => handleFileChange(field, e.target.files[0])}
                        />

                        {isUploading && <span className="dynamic-form__file-status">Envoi en cours...</span>}
                        {uploadErrors[field.name] && (
                            <span className="dynamic-form__error">{uploadErrors[field.name]}</span>
                        )}
                    </div>
                );
            }

            default:
                return (
                    <input
                        {...commonProps}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={values[field.name] ?? ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        step={field.step}
                    />
                );
        }
    };

    return (
        <form className="dynamic-form" onSubmit={handleSubmit}>
            {fields.map((field) => (
                <div
                    className={`dynamic-form__group ${field.type === "checkbox" ? "dynamic-form__group--inline" : ""}`}
                    key={field.name}
                >
                    <label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="dynamic-form__required">*</span>}
                    </label>

                    {renderField(field)}

                    {errors[field.name] && <span className="dynamic-form__error">{errors[field.name]}</span>}
                </div>
            ))}

            <button type="submit" className="dynamic-form__submit" disabled={loading}>
                {loading ? "Enregistrement..." : submitLabel}
            </button>
        </form>
    );
}

export default DynamicForm;