import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';

export const config = {
    api: {
        responseLimit: false,
    },
    maxDuration: 300,
}

// deprecated
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("FETCING FEED")

    return axios.request({
        url: "https://mobile.bereal.com/api" + "/feeds/friends",
        method: "GET",
        headers: getAuthHeaders(req.body.token),
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