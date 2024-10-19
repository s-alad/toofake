
import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import useCheck from '@/utils/check';
import s from './allMemories.module.scss'
import l from '@/styles/loader.module.scss';
import MemoireV2 from '@/components/memoire/memoireV2';
import JSZip from 'jszip';
import MemoryV2 from '../../models/memoryV2';
import FileSaver from 'file-saver';

// Made memories global for downloading (kinda ugly)
let memories: MemoryV2[] = [];

export default function MemoriesV2() {

    useCheck();

    let [_memories, setMemories] = useState<MemoryV2[]>([]);
    let [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });
        let options1 = {
            url: "/api/memoriesV1",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(options1).then(
            async (response) => {
                let data = response.data.data;

                function createMemory(data: any) {
                    let memory = MemoryV2.create(data);
                    memories.push(memory);
                    return memory;
                }

                let counter = 0;
                for (let i = 0; i < data.length; i++) {
                    try {
                        axios.request({
                            url: "/api/memoriesV2?momentId=" + data[i].momentId,
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            data: body,
                        }).then(
                            async (res) => {
                                const posts: any[] = res.data.posts
                                posts.forEach((post: any) => {
                                    createMemory(post)
                                })

                                counter++
                                if (counter >= data.length) {
                                    memories.sort((a, b) => { return a.date > b.date ? -1 : 1 });
                                    setMemories(memories);
                                    setLoading(false);
                                }
                            }
                        ).catch((error) => { console.log(error); })
                    } catch (error) {
                        console.log("COULDN'T MAKE MEMORY WITH DATA: ", data[i])
                        console.log(error);
                    }
                }
            }
        ).catch((error) => { console.log(error); })
    }, []);



    return (
        <div className={s.mem}>
            <div className={s.allMemories}>
                {
                    loading ? <div className={l.loader}></div> :
                        _memories.map((memory, index) => {
                            return (
                                <MemoireV2 memory={memory} key={index} />
                            )
                        })
                }
            </div>


            <div className={s.download}>
                <button id="download" onClick={() => downloadMemories()}>download all as zip</button>

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

async function downloadMemories() {

    // Note: this is JS code not TS which is why it's throwing an error but runs fine

    // @ts-ignore: Object is possibly 'null'.
    let separateImages = document.getElementById("separate").checked;
    // @ts-ignore: Object is possibly 'null'.
    let mergedImage = document.getElementById("merged").checked;
    // @ts-ignore: Object is possibly 'null'.
    let status = document.getElementById("downloadStatus");
    // @ts-ignore: Object is possibly 'null'.
    let error = document.getElementById("error");
    // @ts-ignore: Object is possibly 'null'.
    let downloadButton = document.getElementById("download");

    // Reset text
    // @ts-ignore: Object is possibly 'null'.
    status.textContent = "";
    // @ts-ignore: Object is possibly 'null'.
    error.textContent = "";

    // Don't do anything if no boxes are checked
    if (!(separateImages || mergedImage)) {

        // @ts-ignore: Object is possibly 'null'.
        status.textContent = "No export option selected.";
        return;
    }


    // Disable download button
    // @ts-ignore: Object is possibly 'null'.
    downloadButton.disabled = true;

    const batchSize = 100;
    const batches: MemoryV2[][] = [];
    for (let i = 0; i < memories.length; i += batchSize) {
        batches.push(memories.slice(i, i + batchSize));
    }

    let superZip = new JSZip();
    let superCounter = 0;
    for (let j = 0; j < batches.length; j++) {
        let batch = batches[j];
        let zip = new JSZip();
        console.log("Batch ", j);

        // Loop through each memory
        let counter = 0;
        for (let i = 0; i < batch.length; i++) {
            let memory = batch[i];

            // Update memory status
            // @ts-ignore: Object is possibly 'null'.
            status.textContent = `Zipping, ${(((j * batchSize + i + 1) / (memories.length)) * 100).toFixed(1)}% (Memory ${j * batchSize + i + 1}/${(memories.length)})`


            // Date strings for folder/file names
            let memoryDate = `${memory.date.replaceAll("-", "")}-${memory.time.replaceAll(":", "")}`

            // An error can happen here, InvalidStateException
            // Caused by the primary/secondary image fetch being corrupt,
            // but only happens rarely on specific memories
            try {
                // REPLACE WITH PROPER PROXY SETUP!
                // Fetch image data
                let primary = await fetch("https://toofake-cors-proxy-4fefd1186131.herokuapp.com/" + memory.primary)
                    .then((result) => result.blob())

                let secondary = await fetch("https://toofake-cors-proxy-4fefd1186131.herokuapp.com/" + memory.secondary)
                    .then((result) => result.blob())


                // Create zip w/ image, adapted from https://stackoverflow.com/a/49836948/21809626
                // Zip (primary + secondary separate) 
                if (separateImages) {
                    zip.file(`${memoryDate} -  primary.png`, primary)
                    zip.file(`${memoryDate} - secondary.png`, secondary)
                }

                // Merging images for combined view
                // (Must have canvas declaration here to be accessed by toBlob())
                if (mergedImage) {
                    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

                    let primaryImage = await createImageBitmap(primary);
                    let secondaryImage = await createImageBitmap(secondary);

                    canvas.width = primaryImage.width;
                    canvas.height = primaryImage.height;

                    var ctx = canvas.getContext("2d");

                    // Check if ctx is null for dealing with TS error (not necessary)
                    // Bereal-style combined image
                    // NOTE: secondary image is bugged for custom-uploaded images through the site,
                    // that aren't phone-sized
                    if (ctx) {
                        ctx.drawImage(primaryImage, 0, 0)

                        // Rounded secondary image, adapted from https://stackoverflow.com/a/19593950/21809626

                        // Values relative to image size
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
                        ctx.clip()

                        ctx.drawImage(secondaryImage, x, y, width, height)
                    }

                    canvas.toBlob(async blob => {
                        if (blob) {
                            zip.file(`${memoryDate}.png`, blob)
                            console.log(`Zipped ${j}.${i}`)
                        }

                        counter++
                        if (counter >= batch.length) {
                            zip.generateAsync({ type: 'blob' }).then(function (content: any) {
                                console.log(`Generated zip ${j}`)
                                superZip.file(`batch-${j}.zip`, content)

                                superCounter++
                                if (superCounter >= 3) {
                                    superZip.generateAsync({ type: 'blob' }).then(function (x: any) {
                                        console.log(`Super zipping`)
                                        FileSaver.saveAs(x, `bereal-export-${new Date().toLocaleString("en-us", {
                                            year: "2-digit", month: "2-digit", day: "2-digit"
                                        }).replace(/\//g, '-')}.zip`);

                                        // Reset status
                                        // @ts-ignore: Object is possibly 'null'.
                                        status.textContent = "Zip will download shortly...";

                                        // Enable download button
                                        // @ts-ignore: Object is possibly 'null'.
                                        downloadButton.disabled = false;
                                    })
                                }
                            })
                        }
                    })
                }
            } catch (e) {
                // @ts-ignore: Object is possibly 'null'.
                error.textContent = "Errors found, check console."
                console.log(`ERROR: Memory #${i} on ${memoryDate} could not be zipped:\n${e}`);
            }
        }
    }
}
