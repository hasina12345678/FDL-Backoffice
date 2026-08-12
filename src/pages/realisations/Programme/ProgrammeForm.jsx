import { useState } from "react";

import DynamicForm from "../../../components/DynamicForm/DynamicForm";
import createCrudService from "../../../services/api/genericService";


const programmeService = createCrudService("programmes");


const programmeFields = [
    {
        name:"code",
        label:"Code",
        type:"text",
        required:true,
        placeholder:"Ex: PRD001"
    },
    {
        name:"name",
        label:"Nom",
        type:"text",
        required:true,
        placeholder:"Ex: Programme de développement local"
    },
    {
        name:"description",
        label:"Description",
        type:"textarea",
        required:false,
        placeholder:"Description du programme..."
    }
];


function ProgrammeForm({programme,onSuccess,onCancel}){
    const isEdit = Boolean(programme);
    const [loading,setLoading] = useState(false);
    const [pageError,setPageError] = useState("");

    const initialValues = isEdit
    ?
    {
        code:programme.code,
        name:programme.name,
        description:programme.description
    }
    :
    {};

    const handleSubmit = async(values)=>{
        setLoading(true);
        setPageError("");
        
        const payload = {
            code:values.code,
            name:values.name,
            description:values.description
        };

        try{
            if(isEdit){
                await programmeService.update(
                    programme.id,
                    payload
                );
            }else{
                await programmeService.create(
                    payload
                );
            }

            onSuccess();
        }catch(err){
            setPageError(
                err.message || "Une erreur est survenue."
            );
        }finally{
            setLoading(false);
        }
    };

    return (
        <div>
            {pageError && (
                <p className="form-page__error">
                    {pageError}
                </p>
            )}

            <DynamicForm
                fields={programmeFields}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={loading}
                submitLabel={ isEdit ? "Modifier" : "Créer" }
            />

            <button
                type="button"
                className="form-page__cancel"
                onClick={onCancel}
            >
                Annuler
            </button>
        </div>
    );
}


export default ProgrammeForm;