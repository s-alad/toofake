import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';
import { PROXY } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let authorization_token = req.body.token;
    console.log("friends");
    console.log(authorization_token);

    return axios.request({
        url: `${PROXY}https://mobile.bereal.com/api` + "/relationships/friends",
        method: "GET",
        headers: getAuthHeaders(req.body.token),
    }).then(
        (response) => {
            console.log("------------------")
            console.log("request friends success");
            console.log(response.data);
            console.log("------------------")
            
            res.status(200).json(response.data);
        }
    ).catch(
        (error) => {
            console.log(error);
            res.status(400).json({ status: "error" });
        }
    )
}