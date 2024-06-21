import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { GAPIKEY } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let phone_number = req.body.number;
    console.log(phone_number)

    let receipt_headers = {
        "content-type": "application/json",
        "accept": "*/*",
        "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "accept-language": "en",
        "user-agent":
            "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1",
        "x-firebase-locale": "en",
        "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
    }
    let receipt_body = { "appToken": "54F80A258C35A916B38A3AD83CA5DDD48A44BFE2461F90831E0F97EBA4BB2EC7" }

    let receipt_options = {
        url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyClient?key=${GAPIKEY}`,
        method: "POST",
        headers: receipt_headers,
        data: receipt_body,
    }
    console.log(receipt_options)


    let receipt_response = await axios.request(receipt_options)
    let receipt = receipt_response.data.receipt;

    console.log("receipt response");
    console.log(receipt_response.data);
    console.log('---------------------')


    let otp_request_headers = {
        "content-type": "application/json",
        "accept": "*/*",
        "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "accept-language": "en",
        "user-agent":
            "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.28.2 iPhone/14.7.1 hw/iPhone9_1",
        "x-firebase-locale": "en",
        "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
    }
    let otp_request_body = {
        "phoneNumber": phone_number,
        "iosReceipt": receipt,
    }
    let otp_request_options = {
        url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=${GAPIKEY}`,
        method: "POST",
        headers: otp_request_headers,
        data: otp_request_body,
    }

    return axios.request(otp_request_options).then(
        (response) => {
            console.log("otp request response");
            console.log(response.data);
            console.log('---------------------')
            let session_info = response.data.sessionInfo;
            res.status(200).json({ status: "success", session_info: session_info });
        }
    ).catch(
        (error) => {
            console.log("THERE IS AN ERROR")
            console.log(error.response);
            console.log(error.response.data)
            console.log(error.response.data.error)
            res.status(400).json({ status: "error", errorData: error.response.data.error });
        }
    )

}