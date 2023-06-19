
import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

export default function Feed() {

    useEffect(() => {
        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });

        let options = {
            url: "/api/feed",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data); 

            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )

    }, [])

    return (
        <div>
            <h1>Feed</h1>
        </div>
    )
}