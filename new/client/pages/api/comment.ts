import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let authorization_token = req.body.token;
    let instance_id = req.body.instance_id;
    let comment = req.body.comment;
    console.log("me");
    console.log(authorization_token, instance_id, comment);
    let headers = {
        "authorization": "Bearer " + authorization_token,
    }
    let body = {
        "content": comment,
    }
    let options = {
        url: "https://mobile.bereal.com/api" + "/content/comments/" + "?postId=" + instance_id,
        method: "POST",
        headers: headers,
        data: body,
    }

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
            console.log(error);
            res.status(400).json({ status: "error" });
        }
    )
}