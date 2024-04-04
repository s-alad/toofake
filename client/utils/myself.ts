import axios from "axios";

export default async function myself() {

    console.log("setting myself");

    let token = localStorage.getItem("token");
    let body = JSON.stringify({ "token": token });

    let options = {
        url: "/api/me",
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        data: body,
    }

    return axios.request(options).then(
        (response) => {
            console.log("me resp", response.data); 
            let myselfobject = response.data;
            localStorage.setItem("myself", JSON.stringify(myselfobject));
            return true
        }
    ).catch(
        (error) => {
            console.log(error);
            return false
        }
    )


}