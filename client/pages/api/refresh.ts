import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { PROXY } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let headersList = {
        "Accept": "*/*",
        "User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "Content-Type": "application/json"
    }

    let refresh_token = req.body.refresh;

    console.log("refresh token")
    console.log(refresh_token);

    let refresh_body = JSON.stringify({
        "grant_type": "refresh_token",
        "client_id": "ios",
        "client_secret": "962D357B-B134-4AB6-8F53-BEA2B7255420",
        "refresh_token": refresh_token
    });

    let refresh_options = {
        url: `${PROXY}https://auth.bereal.team/token?grant_type=refresh_token`,
        method: "POST",
        headers: headersList,
        data: refresh_body,
    }

    return axios.request(refresh_options).then(
        (response) => {
            console.log(response.data);
            
            let token = response.data.access_token;
            let refresh = response.data.refresh_token;
            let expiration = Date.now() + response.data.expires_in * 1000;

            res.status(200).json({ status: "success", token: token, refresh: refresh, expiration: expiration });
        }
    ).catch(
        (error) => {
            console.log("ERROR");
            console.log(error);
            res.status(400).json({ status: "error" });
        }
    )
}