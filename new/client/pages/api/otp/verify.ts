import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { generateDeviceId } from '@/utils/device';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    function check_response(response: { status: number; data: any; }) {
        if (response.status > 350) {
            console.log("error | ", response);
            res.status(400).json({ status: "error" });
            return true;
        }
        return false;
    }

    let otp = req.body.code;
    let vonageRequestId = req.body.vonageRequestId;

    console.log('=====================')
    console.log("login process");
    console.log(req.body);
    console.log(otp);
    console.log(vonageRequestId);
    console.log('---------------------')

    let headersList = {"Accept": "application/json","User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0","x-ios-bundle-identifier": "AlexisBarreyat.BeReal","Content-Type": "application/json"}

    let bodyContent = JSON.stringify({
        "code": otp,
        "vonageRequestId": vonageRequestId
    });
    let reqOptions = {
        url: "https://auth.bereal.team/api/vonage/check-code",
        method: "POST",
        headers: headersList,
        data: bodyContent,
    }
    let response = await axios.request(reqOptions);

    if (check_response(response)) {return;}

    let rstatus = response.data.status;
    let token = response.data.token;
    let uid = response.data.uid;
    console.log("validated");
    console.log(response.data);
    console.log('---------------------')

    // ============================================================================================

    let refreshBody = JSON.stringify({
        "token": token,
        "returnSecureToken": "True"
    });
    let refreshOptions = {
        url: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
        method: "POST",
        headers: headersList,
        data: refreshBody,
    }
    let refreshResponse = await axios.request(refreshOptions);

    if (check_response(refreshResponse)) {return;}

    let kind = refreshResponse.data.kind;
    let idToken = refreshResponse.data.idToken;
    let refreshToken = refreshResponse.data.refreshToken;
    let expiresIn = refreshResponse.data.expiresIn;
    let is_new_user = refreshResponse.data.isNewUser;

    console.log("first refresh");
    console.log(refreshResponse.status);
    console.log(refreshResponse.data);
    console.log('---------------------')

    // ============================================================================================

    let firebase_refresh_data = JSON.stringify({
        "grantType": "refresh_token",
        "refreshToken": refreshToken
    });
    let firebase_refresh_options = {
        url: "https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
        method: "POST",
        headers: headersList,
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
        headers: headersList,
        data: access_grant,
    }
    let access_grant_response = await axios.request(access_grant_options);

    if (check_response(access_grant_response)) {return;}

    let access_token = access_grant_response.data.access_token;
    let refresh_token = access_grant_response.data.refresh_token;
    let token_type = access_grant_response.data.token_type;
    let access_expiration = Date.now() + access_grant_response.data.expires_in * 1000;

    console.log("access grant");
    console.log(access_grant_response.status);
    console.log(access_grant_response.data);
    console.log('---------------------')

    res.status(200).json({ 
        token: access_token, 
        refresh_token: refresh_token,
        token_type: token_type,
        expiration: access_expiration,
        uid: uid, 
        is_new_user: is_new_user 
    });
}