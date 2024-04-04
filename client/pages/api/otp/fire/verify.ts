import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { generateDeviceId } from '@/utils/device';
import { GAPIKEY, PROXY } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("PROXY", PROXY)

    try {

    let headers_list = {"Accept": "application/json","User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0","x-ios-bundle-identifier": "AlexisBarreyat.BeReal","Content-Type": "application/json"}

    let otp = req.body.code;
    let session_info = req.body.session_info;

    let fire_otp_headers = {
        "content-type": "application/json",
        "x-firebase-client":
            "apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone9,1 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/14.7.1 xcode/13F100",
        "accept": "*/*",
        "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
        "x-firebase-client-log-type": "0",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "accept-language": "en",
        "user-agent":
            "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
        "x-firebase-locale": "en",
    }

    let fire_otp_body = {
        "code": otp,
        "sessionInfo": session_info,
        "operation": "SIGN_UP_OR_IN"
    }

    let fire_otp_options = {
        url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=${GAPIKEY}`,
        method: "POST",
        headers: fire_otp_headers,
        data: fire_otp_body,
    }

    let fire_otp_response = await axios.request(fire_otp_options);

    let fire_refresh_token = fire_otp_response.data.refreshToken;
    let is_new_user = fire_otp_response.data.isNewUser;
    let uid = fire_otp_response.data.localId;

    console.log("otp response");
    console.log(fire_otp_response.data);
    console.log('---------------------')

    // ============================================================================================

    let firebase_refresh_data = JSON.stringify({
        "grantType": "refresh_token",
        "refreshToken": fire_refresh_token
    });
    let firebase_refresh_options = {
        url: `https://securetoken.googleapis.com/v1/token?key=${GAPIKEY}`,
        method: "POST",
        headers: headers_list,
        data: firebase_refresh_data,
    }
    let firebase_refresh_response = await axios.request(firebase_refresh_options);

    /* if (check_response(firebase_refresh_response)) {return;} */

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
        url: `${PROXY}https://auth.bereal.team/token?grant_type=firebase`,
        method: "POST",
        headers: headers_list,
        data: access_grant,
    }
    let access_grant_response = await axios.request(access_grant_options);

    /* if (check_response(access_grant_response)) {return;} */

    let access_token = access_grant_response.data.access_token;
    let access_refresh_token = access_grant_response.data.refresh_token;
    let access_token_type = access_grant_response.data.token_type;
    let access_expiration = Date.now() + access_grant_response.data.expires_in * 1000;

    console.log("access grant");
    console.log(access_grant_response.status);
    console.log(access_grant_response.data);
    console.log('---------------------')

    res.status(200).json({ 
        token: access_token, 
        refresh_token: access_refresh_token,
        token_type: access_token_type,
        expiration: access_expiration,
        uid: uid, 
        is_new_user: is_new_user 
    });

    
    }
    catch (error: any) {
        console.log("FAILURE")
        console.log(error);
        console.log('---------------------')

        let error_message;

        if (error.response) {
            error_message = JSON.stringify(error.response.data);
        } else {
            error_message = error.toString();
        }
        console.log(error_message);
        res.status(400).json({ error: error_message });
    }

}