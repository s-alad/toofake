
import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import useCheck from '@/utils/check';
import myself from '@/utils/myself';
import s from './memories.module.scss'
import User from '@/models/user';
import Link from 'next/link';
import Memory from '@/models/memory';
import Draggable from 'react-draggable';
import Memoire from '@/components/memoire/memoire';

export default function Profile() {

    useCheck();

    let [memories, setMemories] = useState<Memory[]>([]);

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

                let newmemories: Memory[] = [];

                async function createMemory(data: any) {
                    let newmemory = await Memory.create(data);
                    newmemories.push(newmemory);
                    return newmemory;
                }

                for (let i = 0; i < memorydata.length; i++) {
                    try {
                        await createMemory(memorydata[i]);
                    } catch (error) {
                        console.log("CULDNT MAKE MEMORY WITH DATA: ", memorydata[i])
                        console.log(error);
                    }

                }
                console.log("newmemories");
                console.log(newmemories);

                setMemories(newmemories);
            }
        ).catch((error) => {console.log(error);})
    }, [])

    let [swap, setSwap] = useState<boolean>(false);
    return (
        <div className={s.memories}>
            {
                memories.map((memory, index) => {
                    return (
                        <Memoire memory={memory} key={index} />
                    )
                })
            }
        </div>
    )

}