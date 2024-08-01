import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import useCheck from '@/utils/check';
import s from './memories.module.scss'
import l from '@/styles/loader.module.scss';
import Memory from '@/models/memory';
import Memoire from '@/components/memoire/memoire';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default function Memories(){

    useCheck();

    let [memories, setMemories] = useState<Memory[]>([]);
    let [loading, setLoading] = useState<boolean>(true);

    const createMemories = async (memoryData: any[]): Promise<Memory[]> => {
        return Promise.all(memoryData.map(async (data) => {
            try {
                return await Memory.create(data);
            } catch (error) {
                console.log("COULDN'T MAKE MEMORY WITH DATA: ", data);
                console.log(error);
                throw error; // Let the error propagate to the Promise.all level
            }
        }));
    };

    useEffect(() => {

        const fetchMemories = async () => {
            try {
                const token = localStorage.getItem("token");
                const body = JSON.stringify({ token });
                const options = {
                    url: "/api/memories",
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    data: body,
                };

                const response = await axios.request(options);
                const memoryData = response.data.data;

                const memories: Memory[] = await createMemories(memoryData);

                setMemories(memories);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMemories();
    }, []);

    return (
        <div className={s.mem}>
            <div className={s.memories}>
                {
                    loading ? <div className={l.loader}></div> :
                        memories.map((memory, index) => {
                            return (
                                <Memoire memory={memory} key={index}/>
                            )
                        })
                }
            </div>

            <div className={s.download}>
                <button id="download" onClick={() => downloadMemories(memories)}>download all as zip</button>

                <div>
                    <p id="downloadStatus"></p>
                </div>

                <div className={s.error}>
                    <p id="error"></p>
                </div>

                <div>
                    <div>
                        <label>Export both primary and secondary separately</label>
                        <input type="checkbox" id="separate"></input>
                    </div>
                    <div>
                        <label>Export merged primary + secondary into one image</label>
                        <input type="checkbox" id="merged"></input>
                    </div>
                </div>

                <div className={s.canvas}>
                    <canvas id="myCanvas" width="1000" height="1000"></canvas>
                </div>
            </div>
        </div>
    )
}

const fetchImage = async (url: string): Promise<Blob> => {
    const proxyUrl = "https://toofake-cors-proxy-4fefd1186131.herokuapp.com/" + url;
    const response = await fetch(proxyUrl);
    return await response.blob();
}

const mergeImages = async (primary: Blob, secondary: Blob, monthString: string, dateString: string, zip: JSZip): Promise<void> => {
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const primaryImage = await createImageBitmap(primary);
    const secondaryImage = await createImageBitmap(secondary);

    canvas.width = primaryImage.width;
    canvas.height = primaryImage.height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.drawImage(primaryImage, 0, 0);
        let width = secondaryImage.width * 0.3;
        let height = secondaryImage.height * 0.3;
        let x = primaryImage.width * 0.03;
        let y = primaryImage.height * 0.03;
        let radius = 70;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.lineWidth = 20;
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(secondaryImage, x, y, width, height);

        canvas.toBlob((blob) => {
            if (blob) {
                zip.file(`${monthString}/${dateString}.png`, blob);
            }
        });
    }
}

const processMemory = async (memory: Memory, zip: JSZip, separateImages: boolean, mergedImage: boolean): Promise<any> => {
    let memoryDate = new Date(memory.date);
    memoryDate.setDate(memoryDate.getDate() + 1);

    let monthString = `${memoryDate.getFullYear()}-${memoryDate.toLocaleDateString("en-GB", { month: "2-digit" })}, ${memoryDate.toLocaleString('en-us', {
        month: 'long',
        year: 'numeric'
    })}`.replaceAll("/", "-");
    let dateString = memoryDate.toLocaleString('en-us', { dateStyle: 'long' });

    try {
        let primary = await fetchImage(memory.primary);
        let secondary = await fetchImage(memory.secondary);

        if (separateImages) {
            zip.file(`${monthString}/${dateString} - primary.png`, primary);
            zip.file(`${monthString}/${dateString} - secondary.png`, secondary);
        }

        if (mergedImage) {
            await mergeImages(primary, secondary, monthString, dateString, zip);
        }
    } catch (e) {
        console.log(`ERROR: Memory on ${memoryDate} could not be processed:\n${e}`);
        throw e;
    }
}

const generateAndSaveZip = async (zip: JSZip, downloadButton: HTMLButtonElement | null, status: HTMLElement | null): Promise<void> => {
    setTimeout(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
            FileSaver.saveAs(content, `bereal-export-${new Date().toLocaleString("en-us", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit"
            }).replace(/\//g, '-')}.zip`);
        });

        if (status) status.textContent = "Zip will download shortly...";
        if (downloadButton) downloadButton.disabled = false;
    }, 1000);
}

const downloadMemories = async (memories: Memory[]): Promise<void> => {
    const separateImages = (document.getElementById("separate") as HTMLInputElement)?.checked;
    const mergedImage = (document.getElementById("merged") as HTMLInputElement)?.checked;
    const status = document.getElementById("downloadStatus");
    const error = document.getElementById("error");
    const downloadButton = document.getElementById("download") as HTMLButtonElement;

    if (status) status.textContent = "";
    if (error) error.textContent = "";

    if (!(separateImages || mergedImage)) {
        if (status) status.textContent = "No export option selected.";
        return;
    }

    if (downloadButton) downloadButton.disabled = true;

    const zip = new JSZip();

    try {
        for (let i = 0; i < memories.length; i++) {
            let memory = memories[i];
            if (status) status.textContent = `Zipping, ${(((i + 1) / memories.length) * 100).toFixed(1)}% (Memory ${i + 1}/${memories.length})`;

            await processMemory(memory, zip, separateImages, mergedImage);

            if (i === memories.length - 1) {
                if (status) status.textContent += `, exporting .zip...`;
                await generateAndSaveZip(zip, downloadButton, status);
            }
        }
    } catch (e) {
        if (error) error.textContent = "Errors found, check console.";
        console.log(e);

        if (status) status.textContent += `, exporting .zip...`;
        await generateAndSaveZip(zip, downloadButton, status);
    }
}
