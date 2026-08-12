// services/api/genericService.js
const BASE_URL = "http://localhost:8080/api";

export function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res, errorMessage) {
    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        throw new Error("Session expirée, veuillez vous reconnecter.");
    }

    if (!res.ok) {
        throw new Error(errorMessage);
    }

    return res;
}

function createCrudService(resource) {
    const url = `${BASE_URL}/${resource}`;

    return {
        findAll: async () => {
            const res = await fetch(url, {
                headers: {
                    ...getAuthHeaders(),
                },
            });
            await handleResponse(res, "Erreur de chargement");
            return res.json();
        },

        findById: async (id) => {
            const res = await fetch(`${url}/${id}`, {
                headers: {
                    ...getAuthHeaders(),
                },
            });
            await handleResponse(res, "Élément introuvable");
            return res.json();
        },

        create: async (data) => {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(data),
            });
            await handleResponse(res, "Erreur lors de la création");
            return res.json();
        },

        update: async (id, data) => {
            const res = await fetch(`${url}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(data),
            });
            await handleResponse(res, "Erreur lors de la modification");
            return res.json();
        },

        remove: async (id) => {
            const res = await fetch(`${url}/${id}`, {
                method: "DELETE",
                headers: {
                    ...getAuthHeaders(),
                },
            });
            await handleResponse(res, "Erreur lors de la suppression");
        },
    };
}

export default createCrudService;