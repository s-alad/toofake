import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let authorization_token = req.body.token;
    let profile_id = req.body.profile_id;
    console.log("profile");
    console.log(authorization_token, profile_id);
    let headers = {
        "authorization": "Bearer " + authorization_token,
    }

    return axios.request({
        url: "https://mobile.bereal.com/api" + `/person/profiles/${profile_id}`,
        method: "GET",
        headers: headers,
    }).then(
        (response) => {
            console.log(response.data);
            
            res.status(200).json(response.data);
        }
    ).catch(
        (error) => {
            console.log(error);
            res.status(400).json({ status: "error" });
        }
    )
}