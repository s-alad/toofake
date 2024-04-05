import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';

export const config = {
    api: {
        responseLimit: false,
    },
    maxDuration: 300,
}

// friends feed v1
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("FETCHING FEED")

    let authHeaders = getAuthHeaders(req.body.token);
    console.log(authHeaders);

    return axios.request({
        url: "https://mobile.bereal.com/api" + "/feeds/friends-v1",
        method: "GET",
        headers: getAuthHeaders(req.body.token),
    }).then(
        (response) => {
            console.log("------------------")
            console.log("all request feed success");
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