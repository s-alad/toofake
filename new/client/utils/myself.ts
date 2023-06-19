import axios from "axios";

export default function myself() {

    let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });

        let options = {
            url: "/api/me",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data); 
                let myselfobject = response.data;
                localStorage.setItem("myself", JSON.stringify(myselfobject));
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
}