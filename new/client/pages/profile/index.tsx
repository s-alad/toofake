
import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

export default function Profile() {

    let [username, setUsername] = React.useState<string>("");
    let [name, setName] = React.useState<string>("");
    let [bio, setBio] = React.useState<string>("");

    useEffect(() => {
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
                setUsername(response.data.username);
                setName(response.data.fullname);
                setBio(response.data.biography);

            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )

    }, [])

    return (
        <div>
            <h1>Profile</h1>
            <p>Username: {username}</p>
            <p>Name: {name}</p>
            <p>Bio: {bio}</p>
            
        </div>
    )
}