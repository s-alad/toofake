
import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import Instant from '@/components/instant/instant';
import Instance from '@/models/instance';
import { useState } from 'react';

import { useRouter } from 'next/router'

import useCheck from '@/utils/check';

import s from './feed.module.scss';
import l from '@/styles/loader.module.scss';


export default function Feed() {

    let router = useRouter();
    useCheck();

    let [instances, setInstances] = useState<{ [key: string]: Instance }>({})
    let [loading, setLoading] = useState<boolean>(true);
    let [failure, setFailure] = useState<string>("");

    useEffect(() => {

        setLoading(true);
        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });

        let options = {
            url: "/api/feed",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }
        

        axios.request(options).then(
            async (response) => {
                
                console.log("response.data")
                console.log(response.data);
                let newinstances: { [key: string]: Instance } = {};

                async function createInstance(data: any) {
                    let id = data.id;
                    let newinstance = await Instance.create(data);
                    newinstances[id] = newinstance;
                    return newinstance;
                }

                for (let i = 0; i < response.data.length; i++) {
                    await createInstance(response.data[i]);
                }
                console.log("newinstances");
                console.log(newinstances);
                setInstances(newinstances);
                setLoading(false);
            }
        ).catch(
            (error) => {
                console.log(error);
                setLoading(false);
                setFailure(JSON.stringify(error.response.data.error));
                setTimeout(() => {setFailure("")}, 5000);
            }
        )

    }, [])

    return (
        <div className={s.feed}>
            {
                failure ? 
                    <div className={s.failure}>
                        <div className={s.error}>{failure}</div>
                        <div className={s.help}>something went wrong, please try refreshing the page or re-login</div>
                    </div> 
                : ''
            }
            {
                loading ? <div className={l.loader}></div> :
                Object.keys(instances).map((key, idx) => {
                    return (
                        <Instant key={idx} instance={instances[key]} />
                    )
                })
            }
        </div>
    )
}