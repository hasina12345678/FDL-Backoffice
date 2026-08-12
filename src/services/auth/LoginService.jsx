const API_URL = `${import.meta.env.VITE_API_URL}/auth/login`;

async function login(email, password){
    try{
        const response = await fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        });

        if(!response.ok){
            const message = await response.text();
            return{  success:false, message:message || "Email ou mot de passe incorrect." };
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);

        return{ success:true, token:data.token };

    } catch(error){
        return { success:false, message:"Impossible de contacter le serveur." };
    }
}

export default login;