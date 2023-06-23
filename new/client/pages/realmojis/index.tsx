
import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import useCheck from '@/utils/check';
import myself from '@/utils/myself';

import l from '@/styles/loader.module.scss';
import s from './realmojis.module.scss'

import User from '@/models/user';
import Friend from '@/models/friend';
import Link from 'next/link';

interface Moji {
    id: string;
    emoji: string;
    url: string;
    userId: string;
    type: string;
}

export default function Profile() {

    useCheck();

    let emoji_lookup: {[key: string]: string} = {
        "😍": "heartEyes",
        "😂": "laughing",
        "😲": "surprised", 
        "😃": "happy", 
        "👍": "up"
    }

    let [myRealMojis, setMyRealMojis] = useState<{[key: string]: Moji | undefined}>(
        {
            "😍": undefined,
            "😂": undefined,
            "😲": undefined,
            "😃": undefined,
            "👍": undefined
        }
    );
    
    useEffect(() => {
        myself()

        
        let my_real_mojis = JSON.parse(localStorage.getItem("myself")!).realmojis;
        console.log("MY MOJIS");
        console.log(my_real_mojis);

        let my_current_realmojis = myRealMojis
        for (let i = 0; i < my_real_mojis.length; i++) {

            let emoji = my_real_mojis[i].emoji;

            let my_real_moji: Moji = {
                id: my_real_mojis[i].id,
                emoji: emoji,
                url: my_real_mojis[i].media.url,
                userId: my_real_mojis[i].userId,
                type: emoji_lookup[emoji]
            }

            my_current_realmojis[emoji] = my_real_moji;
        }

        console.log("MY CURRENT MOJIS");
        console.log(my_current_realmojis);

        setMyRealMojis({...my_current_realmojis});

    }, [])

    return (
        <div className={s.realmojis}>
            {
                Object.keys(myRealMojis).map((emoji) => {
                    return (
                        (myRealMojis[emoji] != undefined) ?
                        <div className={s.realmoji} key={myRealMojis[emoji]!.id}>
                            <img src={myRealMojis[emoji]!.url} />
                            <div className={s.details}>
                                <div className={s.emoji}>{emoji}</div>
                                <div className={s.utility}>
                                    <label htmlFor="file-two-upload" className={s.upload}>change realmoji</label>
                                    <input id="file-two-upload" type="file" name="file" onChange={() => {}} />
                                </div>
                            </div>
                        </div>
                        :
                        <div className={s.realmoji}>
                            <div className={s.nomoji} onClick={() => console.log(myRealMojis[emoji])}>no realmoji</div>
                            <div className={s.details}>
                                <div className={s.emoji}>{emoji}</div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )

}