import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { File } from "formidable";
import formidable, { IncomingForm } from "formidable";
import Jimp from "jimp";

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

    const { fields, files } = await parseFormAsync(req);
    //console.log(fields, files)
    let primary: File = (files["primary"] as any as File[])[0];
    let secondary: File = (files["secondary"] as any as File[])[0];
    let caption: string = fields["caption"] as string;
    let authorization_token: string = fields["token"] as string;

    //resize primary image using jimp
    let primary_image = Jimp.read(primary.filepath).then((image) => {
        return image.resize(1500, 2000).quality(100).write(primary.filepath);
    }).catch((err) => {
        console.log(err);
    })
    console.log(await primary_image);
    console.log(primary)

    //resize secondary image using jimp
    let secondary_image = Jimp.read(secondary.filepath).then((image) => {
        return image.resize(1500, 2000).quality(100).write(secondary.filepath);
    }).catch((err) => {
        console.log(err);
    })
    console.log(await secondary_image);
    console.log(secondary)

    return 

    console.log('FORM DATA');
    console.log(authorization_token, caption);
    console.log('---------------------')
    console.log('PRIMARY');
    console.log(primary);
    console.log('---------------------')
    console.log('SECONDARY');
    console.log(secondary);
    console.log('---------------------')

    // ============================================================================================

    let upload_headers = {
        "authorization": "Bearer " + authorization_token,
    }

    let upload_options = {
        url: "https://mobile.bereal.com/api/content/posts/upload-url?mimeType=image/webp",
        method: "GET",
        headers: upload_headers,
    }

    let upload_res = await axios.request(upload_options)

    console.log("upload result");
    console.log(upload_res.data);
    console.log('---------------------')

    let primary_res = upload_res.data.data[0]
    let secondary_res = upload_res.data.data[1]

    let primary_headers = primary_res.headers;
    let primary_url = primary_res.url;
    primary_headers["Authorization"] = "Bearer " + authorization_token

    let secondary_headers = secondary_res.headers;
    let secondary_url = secondary_res.url;
    secondary_headers["Authorization"] = "Bearer " + authorization_token

    console.log("primary headers");
    console.log(primary_headers);

    // ============================================================================================

    let put_primary_options = {
        url: primary_url,
        method: "PUT",
        headers: primary_headers,
        data: primary,
    }
    let put_primary_res = axios.request(put_primary_options).catch((err) => {
        console.log(err);
    })
    /* console.log("put primary result");
    console.log(put_primary_res.data);
    console.log('---------------------') */

    let put_secondary_options = {
        url: secondary_url,
        method: "PUT",
        headers: secondary_headers,
        data: secondary,
    }
    let put_secondary_res = await axios.request(put_secondary_options)
    console.log("put secondary result");
    console.log(put_secondary_res);
    console.log('---------------------')

    res.status(200).json(upload_res.data);
}