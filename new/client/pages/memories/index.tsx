
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


        <div className={s.memories} onClick={() => downloadMemories()}>
            <button>download</button>
        </div>

        </div>

        
    )

}

async function downloadMemories() {

    // Last memory, example
    let memory = newmemories[newmemories.length - 1];

    console.log(memory);

    // REPLACE WITH PROPER PROXY SETUP!
    // Fetch image data
    let request = await fetch("https://api.codetabs.com/v1/proxy?quest=" + memory.primary)



    // Download image, adapted from https://stackoverflow.com/a/64441995/21809626
    // Gets blob, creates anchor, simulates a download
    let blob = await request.blob()

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = "image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);



    


}