
import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import useCheck from '@/utils/check';
import myself from '@/utils/myself';
import s from './memories.module.scss'
import l from '@/styles/loader.module.scss';
import User from '@/models/user';
import Link from 'next/link';
import Memory from '@/models/memory';
import Draggable from 'react-draggable';
import Memoire from '@/components/memoire/memoire';
import JSZip from 'jszip';
import FileSaver from 'file-saver';


// Made memories global for downloading (kinda ugly)
let newmemories: Memory[] = [];

export default function Memories() {

    useCheck();

    let [memories, setMemories] = useState<Memory[]>([]);
    let [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });
        let options = {
            url: "/api/memories",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(options).then(
            async (response) => {
                console.log(response.data);
                let memorydata = response.data.data;

                async function createMemory(data: any) {
                    let newmemory = await Memory.create(data);
                    newmemories.push(newmemory);
                    return newmemory;
                }

                for (let i = 0; i < memorydata.length; i++) {
                    try {
                        await createMemory(memorydata[i]);
                        setLoading(false);
                        setMemories([...newmemories]);
                    } catch (error) {
                        console.log("COULDN'T MAKE MEMORY WITH DATA: ", memorydata[i])
                        console.log(error);
                    }

                }
                console.log("newmemories");
                console.log(newmemories);

            }
        ).catch((error) => { console.log(error); })
    }, []);



    return (

        <div className={s.mem}>
            <div className={s.memories}>
                {
                    loading ? <div className={l.loader}></div> :
                        memories.map((memory, index) => {
                            return (
                                <Memoire memory={memory} key={index} />
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


    let zip = new JSZip();

    // Loop through each memory
    for (let i = 0; i < newmemories.length; i++) {

        let memory = newmemories[i];

        // Update memory status
        // @ts-ignore: Object is possibly 'null'.
        status.textContent = `Zipping, ${(((i + 1) / (newmemories.length)) * 100).toFixed(1)}% (Memory ${i + 1}/${(newmemories.length)})`


        // Date strings for folder/file names
        let memoryDate = new Date(memory.date);
        memoryDate.setDate(memoryDate.getDate() + 1); // Memory date is one day off for some reason?

        // Month string for folder in the form: "yyyy-mm, Month Year"
        let monthString = `${memoryDate.getFullYear()}-${memoryDate.toLocaleDateString("en-GB", { month: "2-digit" })}, ${memoryDate.toLocaleString('en-us', { month: 'long', year: 'numeric' })}`
        monthString = monthString.replaceAll("/", "-"); // Slashes aren't allowed for filenames

        // Date string for files in the form: "Month Day, Year"
        let dateString = memoryDate.toLocaleString('en-us', { dateStyle: 'long' })


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
                zip.file(`${monthString}/${dateString} -  primary.png`, primary)
                zip.file(`${monthString}/${dateString} - secondary.png`, secondary)
            }



            // Merging images for combined view
            // (Must have canvas declaration here to be accessed by toBlob())
            var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

            if (mergedImage) {

                let primaryImage = await createImageBitmap(await primary);
                let secondaryImage = await createImageBitmap(await secondary);

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
            }



            // Save as zip
            // Async stuff: Must have generateAsync in toBlob function to run in proper order

            canvas.toBlob(async (blob) => {

                if (blob && mergedImage) {
                    zip.file(`${monthString}/${dateString}.png`, blob)
                }

                // Only save if on last memory
                if (i == newmemories.length-1) {

                    // @ts-ignore: Object is possibly 'null'.
                    status.textContent += `, exporting .zip...`


                    // NOTE: Some toBlob() calls aren't done by the time we generate the zip,
                    // so instead it just waits for a second (probably change this)
                    setTimeout(() => {

                        // Save w/ zip name of current date
                        zip.generateAsync({ type: 'blob' }).then(function (content: any) {
                            FileSaver.saveAs(content, `bereal-export-${new Date().toLocaleString("en-us", { year: "2-digit", month: "2-digit", day: "2-digit" }).replace(/\//g, '-')}.zip`);
                        });

                        // Reset status
                        // @ts-ignore: Object is possibly 'null'.
                        status.textContent = "Zip will download shortly...";

                        // Enable download button
                        // @ts-ignore: Object is possibly 'null'.
                        downloadButton.disabled = false;

                    }, 1000)


                }
            });

        } catch (e) {

            // @ts-ignore: Object is possibly 'null'.
            error.textContent = "Errors found, check console."
            console.log(`ERROR: Memory #${i} on ${memoryDate} could not be zipped:\n${e}`);

            // Save zip if error was found on the last memory
            if (i == newmemories.length-1) {

                setTimeout(() => {
                    zip.generateAsync({ type: 'blob' }).then(function (content: any) {
                        FileSaver.saveAs(content, `bereal-export-${new Date().toLocaleString("en-us", { year: "2-digit", month: "2-digit", day: "2-digit" }).replace(/\//g, '-')}.zip`);
                    });

                    // @ts-ignore: Object is possibly 'null'.
                    status.textContent = "Zip will download shortly...";

                    // @ts-ignore: Object is possibly 'null'.
                    downloadButton.disabled = false;

                }, 1000)
                
            } else {
                continue;
            }
        }
    }

}



