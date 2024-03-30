import fetch from 'node-fetch';
export const toofakeproxy = async (req, res) => {
    const target = req.query.target;
    if (!target) {
        res.status(400).send('missing target URL.');
        return;
    }
    const headers = {};
    Object.entries(req.headers).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
            headers[key] = value;
        }
    });
    delete headers['host'];
    delete headers['content-length'];
    delete headers["x-vercel-id"];
    console.log('Proxying request to', target, 'headers:', headers);
    try {
        const proxyresponse = await fetch(target, {
            method: req.method,
            headers: headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
            redirect: 'follow',
        });
        const responsebody = await proxyresponse.text();
        console.log('Proxying request to', target, 'status:', proxyresponse.status);
        res.status(proxyresponse.status);
        proxyresponse.headers.forEach((value, name) => {
            res.setHeader(name, value);
        });
        res.send(responsebody);
    }
    catch (error) {
        console.error('Error proxying the request:', error);
        res.status(500).send('Internal Server Error');
    }
};
