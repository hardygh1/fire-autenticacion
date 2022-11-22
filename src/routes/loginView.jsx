import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth"
import { useEffect, useState } from "react";
import { auth, userExists } from "../firebase/firebase";

import { useNavigate } from "react-router-dom";

export default function LoginView(){
    const navigate = useNavigate();

    //Valores de estado
    const [currentUser, setCurrentUser] = useState(null);

    /*
        States:
        0: inicializado
        1: loading
        2: login completo
        3: login pero sin registro
        4: no hay nadie logueado
    */
   const [state, setCurrentState] = useState(0);

    useEffect(()=> {
        setCurrentState(1);
        onAuthStateChanged(auth, handleUserStateChanged);
    },[]);

    //Información del usuario logeado actual
    async function handleUserStateChanged(user){
        if(user){
            const isRegistered = await userExists(user.uid);
            if(isRegistered){
                //TODO: redirigir a Dashboard
                navigate('/dashboard');
                setCurrentState(2);
            } else {
                
                //TODO: redirigir a choose username
                navigate('/choose-username');
                setCurrentState(3);  
            }

            // setCurrentState(3);
            // console.log(user.displayName);
        }else{
            setCurrentState(4);
            console.log("No hay nadie autenticado")
        }
    }

    async function handleOnClick(){
        //Llamar al proveedor de google
        const googleProvider = new GoogleAuthProvider();
        await signInWithGoogle(googleProvider);
    }

    async function signInWithGoogle(googleProvider){
        try{
            const res = await signInWithPopup(auth,googleProvider);
            console.log(res);
        } catch(error){
            console.error(error);
        }
    }

    // Para verifficar el setCurrentState(1); 
    //if(state  == 1){
    //     return <div>Loading...</div>
    // }
    if(state  == 2){
        return <div>Estas autenticado y registrado</div>
    }
    
    if(state  == 3){
        return <div>Estas autenticado pero no registrado</div>
    }
    if(state  == 4){
        return ( 
            <div>
            <button onClick={handleOnClick}>Login  with Google</button>
            </div>
            )  
    }

    return <div>Loading...</div>
    
}