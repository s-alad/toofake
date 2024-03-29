import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { BEREAL_SIGNATURE } from '@/utils/constants';

//testing vercel headers

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let uri = req.query.uri;
    
    if (!uri) {
        res.status(400).json({ status: "error" });
        return;
    }

    let headers = {
        "bereal-app-version-code": "14549",
        "bereal-signature": BEREAL_SIGNATURE,
        "bereal-device-id": "berealdeviceid",
    }

    return axios.request({
        url: uri as string,
        method: "GET",
        headers: headers,
    }).then(
        (response) => {
            console.log("------------------")
            console.log("request success");
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