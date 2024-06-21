import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function useCheck() {
    const router = useRouter();
    
    
    function removeStorage() {
        localStorage.removeItem("token");
        localStorage.removeItem("firebase_refresh_token");
        localStorage.removeItem("firebase_id_token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("uid");
        localStorage.removeItem("is_new_user");
        localStorage.removeItem("token_type");
        localStorage.removeItem("myself")
    }

    useEffect(() => {
        console.log("====================================")
        console.log("CHECKING STATE")

        let token = localStorage.getItem("token");
        let firebase_refresh_token = localStorage.getItem("firebase_refresh_token");
        let expiration = localStorage.getItem("expiration");
        let now = Date.now();
        console.log(token);
        console.log(firebase_refresh_token);
        console.log(expiration);
        console.log(now);

        if (token == null || expiration == null || firebase_refresh_token == null) {
            console.log("no token or expiration or refresh_token");
            removeStorage();
            router.push("/");
            return;
        } else {
            if (now > parseInt(expiration)) {
                console.log("token expired, attempting refresh");

                axios.request(
                    {
                        url: "/api/refresh",
                        method: "POST",
                        data: { refresh: firebase_refresh_token }
                    }
                ).then(
                    (response) => {
                        console.log(response.data);
                        if (response.data.status == "success") {
                            console.log("refresh success");
                            let new_token = response.data.token;
                            let new_firebase_id_token = response.data.firebase_id_token;
                            let new_firebase_refresh_token = response.data.firebase_refresh_token;
                            let expiration = response.data.expiration;

                            localStorage.setItem("token", new_token);
                            localStorage.setItem("firebase_refresh_token", new_firebase_refresh_token);
                            localStorage.setItem("firebase_id_token", new_firebase_id_token);
                            localStorage.setItem("expiration", expiration);

                            console.log("refreshing page");
                            router.reload(); // don't know if this works yet
                            
                        } else {
                            console.log("refresh error");
                            removeStorage();
                            router.push("/");
                            return;
                        }
                    }).catch(
                        (error) => {
                            console.log("refresh fetch error");
                            console.log(error);
                            removeStorage();
                            router.push("/");
                            return;
                        }
                    )
            }
        }

        console.log("token is valid");

        

        if (router.pathname == "/") {
            router.push("/feed");
        }

        console.log("====================================")
    }, [])

    return true;
}