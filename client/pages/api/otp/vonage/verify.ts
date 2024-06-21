import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { GAPIKEY } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    function check_response(response: { status: number; data: any; }) {
        if (response.status > 350 || response.status == 16) {
            console.log("error | ", response);
            res.status(400).json({ status: response });
            return true;
        }
        return false;
    }

    try {

    let otp = req.body.code;
    let vonage_request_id = req.body.vonageRequestId;

    console.log('=====================')
    console.log("login process");
    console.log(req.body);
    console.log(otp);
    console.log(vonage_request_id);
    console.log('---------------------')

    let headers_list = {"Accept": "application/json","User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0","x-ios-bundle-identifier": "AlexisBarreyat.BeReal","Content-Type": "application/json"}

    let vonage_body_content = JSON.stringify({ "code": otp, "vonageRequestId": vonage_request_id });
    let vonage_options = {
        url: "https://auth.bereal.team/api/vonage/check-code",
        method: "POST",
        headers: headers_list,
        data: vonage_body_content,
    }
    let response = await axios.request(vonage_options);

    if (check_response(response)) {return;}

    let rstatus = response.data.status;
    let token = response.data.token;
    let uid = response.data.uid;
    console.log("validated");
    console.log(response.data);
    console.log('---------------------')

    // ============================================================================================

    let refresh_body = JSON.stringify({ "token": token, "returnSecureToken": "True" });
    let refresh_options = {
        url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${GAPIKEY}`,
        method: "POST",
        headers: headers_list,
        data: refresh_body,
    }
    let refresh_response = await axios.request(refresh_options)
    
    let id_token = refresh_response.data.idToken;
    let refresh_token = refresh_response.data.refreshToken;
    let expires_in = refresh_response.data.expiresIn;
    let is_new_user = refresh_response.data.isNewUser;

    console.log("first refresh");
    console.log(refresh_response.status);
    console.log(refresh_response.data);
    console.log('---------------------')

    // ============================================================================================

    let firebase_refresh_data = JSON.stringify({
        "grantType": "refresh_token",
        "refreshToken": refresh_token
    });
    let firebase_refresh_options = {
        url: `https://securetoken.googleapis.com/v1/token?key=${GAPIKEY}`,
        method: "POST",
        headers: headers_list,
        data: firebase_refresh_data,
    }
    let firebase_refresh_response = await axios.request(firebase_refresh_options);

    if (check_response(firebase_refresh_response)) {return;}

    console.log("firebase refresh");
    console.log(firebase_refresh_response.status);
    console.log(firebase_refresh_response.data);
    console.log('---------------------')

    let firebase_token = firebase_refresh_response.data.id_token;
    let firebase_refresh_token = firebase_refresh_response.data.refresh_token;
    let user_id = firebase_refresh_response.data.user_id;
    let firebase_expiration = Date.now() + firebase_refresh_response.data.expires_in * 1000;

    // ============================================================================================

    let access_grant = JSON.stringify({
        "grant_type": "firebase",
        "client_id": "ios",
        "client_secret": "962D357B-B134-4AB6-8F53-BEA2B7255420",
        "token": firebase_token
    });
    let access_grant_options = {
        url: "https://auth.bereal.team/token?grant_type=firebase",
        method: "POST",
        headers: headers_list,
        data: access_grant,
    }
    let access_grant_response = await axios.request(access_grant_options);

    if (check_response(access_grant_response)) {return;}

    let access_token = access_grant_response.data.access_token;
    let access_refresh_token = access_grant_response.data.refresh_token;
    let access_token_type = access_grant_response.data.token_type;
    let access_expiration = Date.now() + access_grant_response.data.expires_in * 1000;

    console.log("access grant");
    console.log(access_grant_response.status);
    console.log(access_grant_response.data);
    console.log('---------------------')

    res.status(200).json({ 
        bereal_access_token: access_token, 
        firebase_refresh_token: firebase_refresh_token,
        firebase_id_token: firebase_token,
        token_type: access_token_type,
        expiration: firebase_expiration,
        uid: uid, 
        is_new_user: is_new_user 
    });
    

    } catch (error: any) {
        console.log("FAILURE")
        console.log(error.response.data);
        res.status(400).json({ error: error.response.data });
    }
}