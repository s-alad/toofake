import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export const config = {
    api: {
        responseLimit: false,
    },
    maxDuration: 300,
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let authorization_token = req.body.token;

    let headers = {
        "authorization": "Bearer " + authorization_token,
        "bereal-app-version-code": "14549",
        "bereal-signature": "MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD",
        'bereal-device-id': '937v3jb942b0h6u9',
        'bereal-timezone': 'Europe/Paris',
    }

    console.log("FETCING FEED")

    return axios.request({
        url: "https://mobile.bereal.com/api" + "/feeds/friends",
        method: "GET",
        headers: headers,
    }).then(
        (response) => {
            console.log("------------------")
            console.log("request feed success");
            console.log(response.data);
            console.log("------------------")

            res.status(200).json(response.data);
        }
    ).catch(
        (error) => {
            console.log(error.response.data);
            res.status(400).json({ status: "error", error: error.response.data });
        }
    )
}