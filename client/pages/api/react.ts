import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';
import { PROXY } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let authorization_token = req.body.token;
    let post_id = req.body.post_id;
    let post_user_id = req.body.post_user_id;
    let emoji = req.body.emoji;

    console.log("me");
    console.log(authorization_token);

    let data = {
        "emoji": `${emoji}`,
    }

    let params = {
        "postId": `${post_id}`,
        "postUserId": `${post_user_id}`,
    }

    return axios.request({
        url: `${PROXY}https://mobile.bereal.com/api` + `/content/realmojis`,
        method: "PUT",
        headers: getAuthHeaders(req.body.token),
        data: data,
        params: params,
    }).then(
        (response) => {
            console.log("------------------")
            console.log("request me success");
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