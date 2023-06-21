import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { generateDeviceId } from '@/utils/device';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let headers_list = {
        "Accept": "*/*",
        "User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "Content-Type": "application/json"
    }
    let phonenumber = req.body.number;
    let device_id: string = generateDeviceId();

    console.log("------------------")
    console.log("request otp");
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
            let vonageRequestId = response.data.vonageRequestId;
            res.status(200).json({ status: "success", vonageRequestId: vonageRequestId });
        }
    ).catch(
        (error) => {
            console.log(error.response.data);
            res.status(400).json({ status: "error" });
        }
    )
}