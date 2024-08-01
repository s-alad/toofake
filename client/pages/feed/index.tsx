import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Instant from '@/components/instant/instant';
import Instance from '@/models/instance';
import Moji from '@/models/moji';
import useCheck from '@/utils/check';

import s from './feed.module.scss';
import l from '@/styles/loader.module.scss';


export default function Feed(){

    // Avoid this
    /*if (!useCheck()) {
        return <></>
    }*/

    // Do this instead
    const isChecked = useCheck();

    const [instances, setInstances] = useState<{ [key: string]: Instance }>({})
    const [loading, setLoading] = useState<boolean>(true);
    const [failure, setFailure] = useState<string>("");
    const [mymojis, setMymojis] = useState<Moji[]>([]);
    const [ad, setAd] = useState<boolean>(true);

    useEffect(() => {
        if (!isChecked) return;

        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            const body = { token };

            try {
                const response = await axios.post("/api/all", body, { headers: { 'Content-Type': 'application/json' } });
                const newInstances: { [key: string]: Instance } = {};
                const createInstance = async (data: any, user: any) => {
                    const id = data.id;
                    const newInstance = await Instance.moment(data, user);
                    newInstances[id] = newInstance;
                };

                const mine = response.data.userPosts;
                if (mine) {
                    await Promise.all(mine.posts.map((post: any) => createInstance(post, mine.user)));
                }

                const friends = response.data.friendsPosts;
                await Promise.all(
                    friends.flatMap((friend: any) =>
                        friend.posts.map((post: any) => createInstance(post, friend.user))
                    )
                );

                setInstances(newInstances);
                setLoading(false);
            } catch (error: any) {
                console.error("FETCHING ERROR", error);
                setFailure(`SOMETHING WENT WRONG: ${JSON.stringify(error.response?.data?.error || error.message)}`);
                setTimeout(() => setFailure(""), 5000);
                setLoading(false);
            }
        }

        fetchData();

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
    }, [isChecked]);

    useEffect(() => {
        if (!isChecked) return;

        let emojiLookup: { [key: string]: string } = {
            "😍": "heartEyes",
            "😂": "laughing",
            "😲": "surprised",
            "😃": "happy",
            "👍": "up"
        }

        const mySelf = localStorage.getItem("myself");
        if (!mySelf) return;

        const myRealMojis = JSON.parse(mySelf).realmojis;
        const myCurrentRealMojis = myRealMojis.map((moji: any) => ({
            id: moji.id,
            emoji: moji.emoji,
            url: moji.media.url,
            userId: moji.userId,
            type: emojiLookup[moji.emoji]
        }));

        setMymojis(myCurrentRealMojis);
    }, [isChecked, loading]);

    const closeAds = () => {
        sessionStorage.setItem("ads", "false");
        setAd(false);
    }

    useEffect(() => {
        if (sessionStorage.getItem("ads") === "false") {
            setAd(false);
        }
    }, []);

    return (
        <div className={s.feed}>
            {failure && (
                <div className={s.failure}>
                    <div className={s.error}>{failure}</div>
                    <div className={s.help}>Something went wrong, please try refreshing the page or re-login</div>
                </div>
            )}
            {loading ? (
                <div className={l.loader}></div>
            ) : (
                Object.keys(instances).length > 0 ? (
                    Object.keys(instances).map((key, idx) => (
                        <Instant key={idx} instance={instances[key]} mymojis={mymojis}/>
                        ))
                    ) : (
                        <div className={s.nothing}>
                            It's quiet here, nobody has posted anything yet.
                        </div>
                    )
            )
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

            }
        </div>
    );
}
