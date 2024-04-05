import { HttpFunction } from '@google-cloud/functions-framework';
import fetch from 'node-fetch';
import { Request, Response } from 'express';

// issues working on certain request endpoints
export const toofakeproxy: HttpFunction = async (req: Request, res: Response) => {
    const target = req.query.target as string;

    if (!target) {
        console.error(JSON.stringify({ message: 'Missing target URL', status: 400 }));
        res.status(400).send('missing target URL.');
        return;
    }

    const headers: Record<string, string> = {};
    Object.entries(req.headers).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
            headers[key] = value;
        }
    });

    console.log("proxying request - headers", "target: ", target);

    delete headers['host'];
    delete headers['content-length'];
    delete headers["x-vercel-id"];


    try {   
        const proxyresponse = await fetch(target, {
            method: req.method,
            headers: headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
            redirect: 'follow',
        });

        const responsebody = await proxyresponse.text();
        console.log(JSON.stringify({
            message: 'Received proxy response',
            target,
            status: proxyresponse.status,
            responseHeaders: [...proxyresponse.headers],
            body: responsebody,
        }));
        proxyresponse.headers.forEach((value, name) => {
            res.setHeader(name, value);
        });
        console.log("sending response back to client", target);
        res.status(proxyresponse.status).send(responsebody);
    } catch (error) {
        console.error('Error proxying the request:', error);
        res.status(500).send('Internal Server Error');
    }
};