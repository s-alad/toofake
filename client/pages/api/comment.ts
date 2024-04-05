import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';
import { PROXY } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let authorization_token = req.body.token;
    let instance_id = req.body.instance_id;
    let poster_user_id = req.body.poster_user_id;
    let comment = req.body.comment;
    console.log("me");
    console.log(authorization_token)
    console.log(instance_id, comment);

    let body = {
        content: comment, 
    }
    let options = {
        url: `${PROXY}https://mobile.bereal.com/api` + "/content/comments" + "?postId=" + instance_id + "&postUserId=" + poster_user_id,
        method: "POST",
        headers: getAuthHeaders(req.body.token),
        data: body,
    }

    console.log("FETCHING COMMENT")
    console.log(options);

    return axios.request(options).then(
        (response) => {
            console.log("------------------")
            console.log("request comment success");
            console.log(response.data);
            console.log("------------------")
            
            res.status(200).json(response.data);
        }
    ).catch(
        (error) => {
            console.log(error.response.data);
            res.status(400).json({ status: "error" });
        }
    )
}