
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
import Moji from '@/models/moji';

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";



export default function Feed() {

    let router = useRouter();
    if (!useCheck()) {
        return <></>
    }
    
    let [instances, setInstances] = useState<{ [key: string]: Instance }>({})
    let [loading, setLoading] = useState<boolean>(true);
    let [failure, setFailure] = useState<string>("");

    useEffect(() => {

        setLoading(true);
        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });

        /* 
        old feed api
        
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
                    setLoading(false);
                }

                for (let i = 0; i < response.data.length; i++) {
                    try {
                        await createInstance(response.data[i]);
                        setInstances({...newinstances});
                        setLoading(false);
                    } catch (error) {
                        console.log("CULDNT MAKE INSTANCE WITH DATA: ", response.data[i])
                        console.log(error);
                    }
                    
                }
                console.log("newinstances");
                console.log(newinstances);
                setLoading(false);
            }
        ).catch(
            (error) => {
                console.log("FETCHING ERROR")
                console.log(error);
                setLoading(false);
                setFailure("SOMETHING WENT WRONG: " + JSON.stringify(error.response.data.error));
                setTimeout(() => {setFailure("")}, 5000);
            }
        ) 
        */

        let testoptions = {
            url: "/api/all",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(testoptions).then(
            async (response) => {
                console.log("=====================================")
                console.log("all feed data")
                console.log(response.data);
                console.log("=====================================")

                let newinstances: { [key: string]: Instance } = {};
                async function createInstance(data: any, usr: any) {
                    let id = data.id;
                    let newinstance = await Instance.moment(data, usr);
                    newinstances[id] = newinstance;
                    setLoading(false);
                }

                let mine = response.data.userPosts;

                //check if mine is undefined
                if (mine != undefined) {
                    let myposts = mine.posts;
                    for (let i = 0; i < myposts.length; i++) {
                        let post = myposts[i];
                        try {
                            await createInstance(post, mine.user);
                            setInstances({...newinstances});
                            setLoading(false);
                        } catch (error) {
                            console.log("COULDNT MAKE INSTANCE WITH DATA: ", post)
                            console.log(error);
                        }
                    }
                } else {
                    console.log("I have no posts")
                }

                let friends = response.data.friendsPosts;

                for (let i = 0; i < friends.length; i++) {
                    let thisuser = friends[i].user;
                    let posts = friends[i].posts;
                    for (let j = 0; j < posts.length; j++) {
                        let post = posts[j];
                        try {
                            await createInstance(post, thisuser);
                            setInstances({...newinstances});
                            setLoading(false);
                        } catch (error) {
                            console.log("COULDNT MAKE INSTANCE WITH DATA: ", post)
                            console.log(error);
                        }
                    }
                }
                console.log("newfriendinstances");
                console.log(newinstances);
                setLoading(false);
            }).catch(
                (error) => {
                    console.log("FETCHING ERROR")
                    console.log(error);
                    setLoading(false);
                    setFailure("SOMETHING WENT WRONG: " + JSON.stringify(error.response.data.error));
                    setTimeout(() => {setFailure("")}, 5000);
                }
            )
    }, [])


    let emoji_lookup: {[key: string]: string} = {
        "😍": "heartEyes",
        "😂": "laughing",
        "😲": "surprised", 
        "😃": "happy", 
        "👍": "up"
    }
    let [mymojis, setMymojis] = useState<Moji[]>([]);
    useEffect(() => {

        if (localStorage.getItem("myself") == undefined) return;

        let my_real_mojis = JSON.parse(localStorage.getItem("myself")!).realmojis;

        let my_current_realmojis: Moji[] = []
        for (let i = 0; i < my_real_mojis.length; i++) {

            let emoji = my_real_mojis[i].emoji;

            let my_real_moji: Moji = {
                id: my_real_mojis[i].id,
                emoji: emoji,
                url: my_real_mojis[i].media.url,
                userId: my_real_mojis[i].userId,
                type: emoji_lookup[emoji]
            }

            my_current_realmojis.push(my_real_moji);
        }
        
        setMymojis([...my_current_realmojis]);
        
    }, [loading])


    let [ad, setAd] = useState<boolean>(true);
    function closeAds() {
        sessionStorage.setItem("ads", "false");
        setAd(false);
    }
    useEffect(() => {
        let ads = sessionStorage.getItem("ads");
        if (ads == "false") { setAd(false);}
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
                /* 
                    Object.keys(instances).map((key, idx) => {
                        const elements = [];
                        elements.push(<Instant key={idx} instance={instances[key]} mymojis={mymojis}/>);

                        if ((idx + 1) % 3 === 2) {
                            elements.push(
                                <div className={`${s.ad} ${ad ? '' : s.hide}`}>
                                    <div className={s.head}>
                                        advertisment
                                        <FontAwesomeIcon icon={faClose} className={s.close}
                                            onClick={closeAds}
                                        />
                                    </div>
                                </div>
                                );
                        }

                        return elements;
                    })  
                */

                loading ? <div className={l.loader}></div> :
                (
                    Object.keys(instances).length > 0 ? 
                    Object.keys(instances).map((key, idx) => {
                        return (
                            <Instant key={idx} instance={instances[key]} mymojis={mymojis}/>
                        )
                    }) :
                    <div className={s.nothing}>
                        It's quiet here, nobody has posted anything yet.
                    </div>
                )
            }
        </div>
    )
}