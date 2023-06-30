
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
                        console.log("CULDNT MAKE MEMORY WITH DATA: ", memorydata[i])
                        console.log(error);
                    }

                }
                console.log("newmemories");
                console.log(newmemories);

            }
        ).catch((error) => {console.log(error);})
    }, []);

    

    return (

        <div>

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


        <div className={s.memories}>
            <button onClick={() => downloadMemories()}>download</button>
        </div>

        <div>
            <p></p>
            <label>Export both primary and secondary separately</label>
            <input type="checkbox" id="separate"></input>
            <p></p>
            <label>Export merged primary + secondary into one image</label>
            <input type="checkbox" id="merged"></input>
        </div>
        
        <canvas id="myCanvas" width="1000" height="1000"></canvas>

        </div>

        
    )

}

async function downloadMemories() {

    
    // Note: this is JS code not TS which is why it's throwing an error but runs fine

    // @ts-ignore: Object is possibly 'null'.
    let separateImages = document.getElementById("separate").checked;
    // @ts-ignore: Object is possibly 'null'.
    let mergedImage = document.getElementById("merged").checked;
    


    console.log(`Separate: ${separateImages}, Merged: ${mergedImage}`)


    // Don't do anything if no boxes are checked
    if (!(separateImages || mergedImage)) {
        console.log("No export setting selected");
        return;
    }
    
    // Last memory, example
    let memory = newmemories[newmemories.length - 1];
    let date = new Date(memory.date);

    // Date strings for folder/file names
    let monthString = date.toLocaleString('en-us',{month:'long', year:'numeric'})
    let dateString = date.toLocaleString('en-us', {dateStyle:'long'})



    // REPLACE WITH PROPER PROXY SETUP!
    // Fetch image data
    let primary = fetch("https://api.codetabs.com/v1/proxy?quest=" + memory.primary)
                  .then((result) => result.blob())

    let secondary = fetch("https://api.codetabs.com/v1/proxy?quest=" + memory.secondary)
                  .then((result) => result.blob())

    

    // Create zip w/ image, adapted from https://stackoverflow.com/a/49836948/21809626
    // (Change this to use the matching extension)

    // Zip (primary + secondary) 

    let zip = new JSZip();

    if (separateImages) {
        zip.file(`${monthString}/${dateString} -  primary.jpg`, primary)
        zip.file(`${monthString}/${dateString} - secondary.jpg`, secondary)
    }


    
    // Merging images for combined view
    
    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    if (mergedImage) {
        console.log("Running merge")
        let primaryImage = await createImageBitmap(await primary);
        let secondaryImage = await createImageBitmap(await secondary);


        
        canvas.width = primaryImage.width;
        canvas.height
         = primaryImage.height;

        var ctx = canvas.getContext("2d");
        var imageObj = new Image();
        
        // For dealing with error, bereal-style combined image
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
            ctx.lineTo(500,500)

            ctx.closePath();
            
            ctx.lineWidth = 20;
            ctx.stroke();

            ctx.fill()
            ctx.clip()

            ctx.drawImage(secondaryImage, x, y, width, height)
        }    
    }

    
    
    // Save as zip
    // Async stuff: Must have generateAsync in toBlob function to run in proper order

    canvas.toBlob(async (blob) => {
        console.log("Running toBlob")
        if (blob && mergedImage) {
            zip.file(`${monthString}/${dateString}.jpg`, blob)
        }

        console.log("Running generate")
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            FileSaver.saveAs(content, 'download.zip');
        });
        
    });  

        
    
    
    

}



