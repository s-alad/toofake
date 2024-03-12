
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
import Realmoji from '@/components/realmoji/realmoji';
import Moji from '@/models/moji';

export default function RealMojis() {

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

        if (!localStorage.getItem("myself")) {
            return;
        }
        
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
                Object.keys(myRealMojis).map((emoji, index) => {
                    return (
                        <Realmoji emoji={emoji} realmoji={myRealMojis} key={index}/>
                    )
                })
            }
        </div>
    )

}