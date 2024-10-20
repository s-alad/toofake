import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';
import { PROXY } from '@/utils/constants';

export const config = {
    api: {
        responseLimit: false,
    },
    maxDuration: 300,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        return axios.request({
            url: `${PROXY}https://mobile.bereal.com/api` + "/feeds/memories-v2/" + req.query.momentId,
            method: "GET",
            headers: getAuthHeaders(req.body.token),
        }).then(
            (response) => {
                res.status(200).json(response.data);
            }
        ).catch(
            (error) => {
                console.log(error);
                res.status(400).json({ status: "error" });
            }
        )
    } catch (e) {
        console.log(`-----------retrying ${req.query.momentId}-----------`);
        handler(req, res);
    }
}