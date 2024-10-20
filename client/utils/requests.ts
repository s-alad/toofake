import axios from "axios";

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

const fetchSignature = async (i: number = 0): Promise<any> => {
    try {
        const res = await axios.get("https://sig.beunblurred.co/get?token=sOWSRnugxI");
        return res.data;
    } catch (e) {
        if (i < 3) {
            await sleep(250);
            return await fetchSignature(i + 1);
        } else {
            throw e;
        }
    }
};

export {
    fetchSignature
};
