import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
/* import { File } from "formidable";
import formidable, { IncomingForm } from "formidable"; */
import Jimp from "jimp";
import fs from "fs";
import sharp from 'sharp';
import moment from 'moment';
import { getAuthHeaders } from '@/utils/authHeaders';

export const config = {
    api: {
        bodyParser: { sizeLimit: '12mb', },
    }
};

/* export type FormidableParseReturn = {
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
} */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {

        /*
        const { fields, files } = await parseFormAsync(req);
        console.log(fields, files)

        let authorization_token: string = fields["token"] as string;
        let filebase64: string = fields["fileBase64"][0] as string;
        let emoji: string = fields["emoji"] as string; 
        */

        // using fetch
        let authorization_token: string = req.body.token;
        let filebase64: string = req.body.fileBase64;
        let emoji: string = req.body.emoji;

        console.log("emoji");
        console.log(emoji);

        // log the first 20 chars of the base64 string
        console.log("BASE64 STRINGS 20chars");
        console.log(filebase64.substring(0, 40));
        console.log('---------------------')

        // drop prefix of base64 string
        filebase64 = filebase64.replace(/^data:(image|application)\/(png|webp|jpeg|jpg|octet-stream);base64,/, "");

        // ============================================================================================

        //convert base64 to buffer
        let file_image_buffer = Buffer.from(filebase64, 'base64');
        console.log("IMAGE BUFFER");
        console.log(file_image_buffer);
        console.log('---------------------')

        let sharp_file = await sharp(file_image_buffer).toBuffer();
        const primary_mime_type = (await sharp(sharp_file).metadata()).format;

    
        console.log("SHARP IMAGES");
        console.log(sharp_file);
        console.log(primary_mime_type);
        console.log('---------------------')

    
        if (primary_mime_type != 'webp') {
            sharp_file = await sharp(sharp_file).toFormat('webp').toBuffer();
        }

        // ============================================================================================
        // upload url

        let upload_options = {
            url: "https://mobile.bereal.com/api/content/realmojis/upload-url?mimeType=image/webp",
            method: "GET",
            headers: getAuthHeaders(authorization_token),
        }
    
        let upload_res = await axios.request(upload_options)
    
        console.log("upload result");
        console.log(upload_res.data);
        console.log('---------------------')

        let primary_res = upload_res.data.data
    
        let primary_headers = primary_res.headers;
        let primary_url = primary_res.url;
        let primary_path = primary_res.path;
        let primary_bucket = primary_res.bucket;
        Object.assign(primary_headers, getAuthHeaders(authorization_token))
    
        // ============================================================================================

        let put_file_options = {
            url: primary_url,
            method: "PUT",
            headers: primary_headers,
            /* data: secondary, */
            data: sharp_file,
        }
        let put_file_res = await axios.request(put_file_options)
        console.log("put secondary result");
        console.log(put_file_res.status);
        console.log('---------------------')
    
        // ============================================================================================

        let post_data: any = {
            "media": {
                "bucket": primary_bucket,
                "path": primary_path,
                "width": 500,
                "height": 500,
            },
            "emoji": `${emoji}`
        };
        let post_headers = {
            "content-type": "application/json",
            "bereal-platform": "iOS",
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
            method: 'PUT',
            url: "https://mobile.bereal.com/api" + "/person/me/realmojis",
            data: JSON.stringify(post_data),
            headers: post_headers,
        })
    
        console.log("post response");
        console.log(post_response);
        console.log('---------------------')
    
        res.status(200).json(upload_res.data.data);


    } catch (error: any) {
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