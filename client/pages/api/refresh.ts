import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { GAPIKEY, PROXY } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let headers_list = {"Accept": "application/json","User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0","x-ios-bundle-identifier": "AlexisBarreyat.BeReal","Content-Type": "application/json"}
    let firebase_refresh_token = req.body.refresh;

    let firebase_refresh_data = JSON.stringify({
        "grantType": "refresh_token",
        "refreshToken": firebase_refresh_token
    });
    let firebase_refresh_options = {
        url: `https://securetoken.googleapis.com/v1/token?key=${GAPIKEY}`,
        method: "POST",
        headers: headers_list,
        data: firebase_refresh_data,
    }
    let firebase_refresh_response = await axios.request(firebase_refresh_options);

    let new_firebase_token = firebase_refresh_response.data.id_token;
    let new_firebase_refresh_token = firebase_refresh_response.data.refresh_token;
    let firebase_expiration = Date.now() + firebase_refresh_response.data.expires_in * 1000;

    // ============================================================================================

    let access_grant = JSON.stringify({
        "grant_type": "firebase",
        "client_id": "ios",
        "client_secret": "962D357B-B134-4AB6-8F53-BEA2B7255420",
        "token": new_firebase_token
    });
    let access_grant_options = {
        url: `${PROXY}https://auth.bereal.team/token?grant_type=firebase`,
        method: "POST",
        headers: headers_list,
        data: access_grant,
    }
    return await axios.request(access_grant_options).then(
        (response) => {
            let bereal_access_token = response.data.access_token;
            res.status(200).json({
                status: "success",
                token: bereal_access_token,
                firebase_id_token: new_firebase_token,
                firebase_refresh_token: new_firebase_refresh_token,
                expiration: firebase_expiration
            })
        }
    ).catch(
        (error) => {
            console.log("ERROR");
            console.log(error);
            res.status(400).json({ status: "error" });
        }
    );
}