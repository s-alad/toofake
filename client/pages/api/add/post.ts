import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { File } from "formidable";
import formidable, { IncomingForm } from "formidable";
import Jimp from "jimp";
import fs from "fs";
import sharp from 'sharp';
import moment from 'moment';
// @ts-ignore
import * as convert from 'heic-convert';
import { getAuthHeaders } from '@/utils/authHeaders';
import { PROXY } from '@/utils/constants';

export const config = {
    api: {
        bodyParser: false
    }
};

export type FormidableParseReturn = {
    fields: formidable.Fields;
    files: formidable.Files;
};

export async function parseFormAsync(req: NextApiRequest, formidableOptions?: formidable.Options): Promise<FormidableParseReturn> {
    const form = formidable(formidableOptions);

    return await new Promise<FormidableParseReturn>((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                reject(err);
            }

            resolve({ fields, files });
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {

        const { fields, files } = await parseFormAsync(req);
        /* console.log(fields, files) */

        let caption: string = fields["caption"] as string;
        let authorization_token: string = fields["token"] as string;
        let primaryb64: string = fields["primaryb64"][0] as string;
        let secondaryb64: string = fields["secondaryb64"][0] as string;

        // log the first 20 chars of the base64 string
        console.log("BASE64 STRINGS 40 chars");
        console.log(primaryb64.substring(0, 40));
        console.log(secondaryb64.substring(0, 40));
        console.log('---------------------')

        // drop prefix of base64 string
        // the possible formats are png, jpeg, jpg, octet-stream
        // the possible data formats are image and application

        let isPrimaryHeic = false;
        if (primaryb64.startsWith("data:application/octet-stream;base64,")) {
            isPrimaryHeic = true;
        }
        let isSecondaryHeic = false;
        if (secondaryb64.startsWith("data:application/octet-stream;base64,")) {
            isSecondaryHeic = true;
        }

        primaryb64 = primaryb64.replace(/^data:(image|application)\/(png|webp|jpeg|jpg|octet-stream);base64,/, "");
        secondaryb64 = secondaryb64.replace(/^data:(image|application)\/(png|webp|jpeg|jpg|octet-stream);base64,/, "");
        /* primaryb64 = primaryb64.replace(/^data:image\/(png|jpeg|jpg|octet-stream);base64,/, "");
        secondaryb64 = secondaryb64.replace(/^data:image\/(png|jpeg|jpg|octet-stream);base64,/, ""); */

        // ============================================================================================

        //convert base64 to buffer
        let primary_image_buffer = Buffer.from(primaryb64, 'base64');
        let secondary_image_buffer = Buffer.from(secondaryb64, 'base64');
        console.log("IMAGE BUFFERS");
        console.log(primary_image_buffer);
        console.log('---------------------')
        console.log(secondary_image_buffer);
        console.log('=====================')

        // ============================================================================================

        /* if (isPrimaryHeic) {
            console.log("CONVERTING HEIC TO JPG");
            primary_image_buffer = await convert({
                buffer: primary_image_buffer, // the HEIC file buffer
                format: 'JPEG',      // output format
                quality: 1           // the jpeg compression quality, between 0 and 1
            });
        }

        if (isSecondaryHeic) {
            console.log("CONVERTING HEIC TO JPG");
            secondary_image_buffer = await convert({
                buffer: secondary_image_buffer, // the HEIC file buffer
                format: 'JPEG',      // output format
                quality: 1           // the jpeg compression quality, between 0 and 1
            });
        } */

        // ============================================================================================

        let sharp_primary = await sharp(primary_image_buffer).toBuffer();
        let sharp_secondary = await sharp(secondary_image_buffer).toBuffer();

        const primary_mime_type = (await sharp(sharp_primary).metadata()).format;
        const secondary_mime_type = (await sharp(sharp_secondary).metadata()).format;

        console.log("SHARP IMAGES");
        console.log(sharp_primary);
        console.log(primary_mime_type);
        console.log('---------------------')
        console.log(sharp_secondary);
        console.log(secondary_mime_type);
        console.log('=====================')

        if (primary_mime_type != 'webp') {
            sharp_primary = await sharp(sharp_primary).toFormat('webp').toBuffer();
        }
        if (secondary_mime_type != 'webp') {
            sharp_secondary = await sharp(sharp_secondary).toFormat('webp').toBuffer();
        }

        /* console.log("SHARP IMAGES AFTER CONVERSION");
        console.log(sharp_primary);
        console.log('---------------------')
        console.log(sharp_secondary);
        console.log('=====================') */

        // ============================================================================================
        // upload url

        let upload_options = {
            url: `${PROXY}https://mobile.bereal.com/api/content/posts/upload-url?mimeType=image/webp`,
            method: "GET",
            headers: getAuthHeaders(authorization_token),
        }

        let upload_res = await axios.request(upload_options)

        console.log("upload result");
        console.log(upload_res.data);
        console.log('---------------------')

        let primary_res = upload_res.data.data[0]
        let secondary_res = upload_res.data.data[1]

        let primary_headers = primary_res.headers;
        let primary_url = primary_res.url;
        let primary_path = primary_res.path;
        let primary_bucket = primary_res.bucket;
        Object.assign(primary_headers, getAuthHeaders(authorization_token))

        let secondary_headers = secondary_res.headers;
        let secondary_url = secondary_res.url;
        let secondary_path = secondary_res.path;
        let secondary_bucket = secondary_res.bucket;
        Object.assign(secondary_headers, getAuthHeaders(authorization_token))

        // ============================================================================================

        let put_primary_options = {
            url: primary_url,
            method: "PUT",
            headers: primary_headers,
            /* data: primary, */
            data: sharp_primary,
        }
        let put_primary_res = await axios.request(put_primary_options)
        console.log("put primary result");
        console.log(put_primary_res.status);
        console.log('---------------------')

        let put_secondary_options = {
            url: secondary_url,
            method: "PUT",
            headers: secondary_headers,
            /* data: secondary, */
            data: sharp_secondary,
        }
        let put_secondary_res = await axios.request(put_secondary_options)
        console.log("put secondary result");
        console.log(put_secondary_res.status);
        console.log('---------------------')

        // ============================================================================================

        let taken_at = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        let post_data: any = {
            "isLate": false,
            "retakeCounter": 0,
            takenAt: taken_at,
            /* content: caption.toString(), */ // might not be working
            visibility: ["friends"],
            backCamera: {
                bucket: primary_bucket,
                height: 1500,
                width: 2000,
                path: primary_path,
            },
            frontCamera: {
                bucket: secondary_bucket,
                height: 1500,
                width: 2000,
                path: secondary_path,
            },
        };
        let post_headers = {
            "content-type": "application/json",
            'bereal-app-version-code': '14549',
            "bereal-os-version": "14.7.1",
            "accept-language": "en-US;q=1.0",
            "bereal-app-language": "en-US",
            "user-agent": "BeReal/0.28.2 (AlexisBarreyat.BeReal; build:8425; iOS 14.7.1) 1.0.0/BRApiKit",
            "bereal-device-language": "en",
            ...getAuthHeaders(authorization_token)
        }
        console.log("post data");
        console.log(post_data);
        console.log(post_headers)
        console.log('---------------------')

        let post_response = await axios.request({
            method: 'POST',
            url: 'https://mobile.bereal.com/api/content/posts',
            data: JSON.stringify(post_data),
            headers: post_headers,
        })

        console.log("post response");
        console.log(post_response);
        console.log('---------------------')

        res.status(200).json(upload_res.data);

    } catch (error: any) {
        console.log("FAILURE")
        console.log(error);
        console.log('---------------------')

        let error_message;

        if (error.response) {
            error_message = JSON.stringify(error.response.data);
            console.log(error.response.data);
        } else {
            error_message = error.toString();
        }
        console.log(error_message);
        res.status(400).json({ error: error_message });
    }
}