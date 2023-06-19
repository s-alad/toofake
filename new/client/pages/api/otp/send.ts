import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { generateDeviceId } from '@/utils/device';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "Content-Type": "application/json"
    }
    let phonenumber = req.body.number;

    let dId: string = generateDeviceId();

    console.log("request otp");
    console.log(phonenumber);
    console.log(dId);
    console.log("------------------")

    let bodyContent = JSON.stringify({
        "phoneNumber": phonenumber,
        "deviceId": dId,
    });

    let reqOptions = {
        url: "https://auth.bereal.team/api/vonage/request-code",
        method: "POST",
        headers: headersList,
        data: bodyContent,
    }

    return axios.request(reqOptions).then(
        (response) => {
            let rstatus = response.data.status;
            let vonageRequestId = response.data.vonageRequestId;
            res.status(200).json({ status: "success", vonageRequestId: vonageRequestId });
        }
    ).catch(
        (error) => {
            console.log(error);
            res.status(400).json({ status: "error" });
        }
    )
}