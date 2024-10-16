import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { generateDeviceId } from '@/utils/device';
import { fetchSignature } from "@/utils/requests";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let headers_list = {
		"Accept": "*/*",
		"User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
		"x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
		"Content-Type": "application/json",
		"bereal-app-version-code": "14549",
		"bereal-signature": (await fetchSignature()),
		"bereal-device-id": "937v3jb942b0h6u9",
		"bereal-timezone": "Europe/Paris",
    }

    let phonenumber = req.body.number;
    let device_id: string = generateDeviceId();

    console.log("------------------")
    console.log("request vonage otp");
    console.log(phonenumber, device_id);
    console.log("------------------")

    let body_content = JSON.stringify({ "phoneNumber": phonenumber, "deviceId": device_id });
    let req_options = {
        url: "https://auth.bereal.team/api/vonage/request-code",
        method: "POST",
        headers: headers_list,
        data: body_content,
    }

    return axios.request(req_options).then(
        (response) => {
            let rstatus = response.data.status;
            let vonage_request_id = response.data.vonageRequestId;
            res.status(200).json({ status: "success", vonageRequestId: vonage_request_id });
        }
    ).catch(
        (error) => {
            console.log(error.response);
            res.status(400).json({ error: error.response.data });
        }
    )
}