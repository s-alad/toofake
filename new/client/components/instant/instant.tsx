import Instance from "@/models/instance";

import s from './instant.module.scss';
import Draggable from "react-draggable";
import { useState } from "react";
import Link from "next/link";

interface _Instant {
    instance: Instance;
}

export default function Instant({ instance }: _Instant) {

    let [swap, setSwap] = useState<boolean>(false);
    let [expanded, setExpanded] = useState<boolean>(false);

    console.log("instance")
    console.log(instance);

    let profile_link = instance.user.uid == localStorage.getItem("uid") ? "/me" : `/profile/${instance.user.uid}`;

    function pfp() {
        if (instance.user.pfp) {
            return <img src={instance.user.pfp} />
        } else {
            return <div className={s.letter}>{instance.user.username.toUpperCase().charAt(0)}</div>
        }
    }

    return (
        <div className={s.instant}>

            <div className={s.top}>
                <div className={s.pfp}>
                    <Link href={profile_link}>{pfp()}</Link>
                </div>
                <div className={s.details}>
                    <Link href={profile_link}><div className={s.username}> @{instance.user.username} </div></Link>
                    <div className={s.location}> {instance.location} </div>
                </div>
            </div>

            <div className={s.content}>
                <img src={swap ? instance.primary : instance.secondary} className={s.primary} />
                <div className={s.bounds}>
                    <Draggable axis="both" bounds="parent">
                        <img src={swap ? instance.secondary : instance.primary} className={s.secondary} onClick={() => setSwap(!swap)} />
                    </Draggable>
                </div>
                <div className={s.realmojis}>
                    {
                        instance.realmojis.map((realmoji) => {
                            return (
                                <Link href={`/profile/${realmoji.owner.uid}`} key={realmoji.emoji_id}>
                                    <div className={s.realmoji} key={realmoji.emoji_id}>
                                        <div className={s.moji}>{realmoji.emoji}</div>
                                        <img src={realmoji.uri} />
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>

            <div className={s.caption}>
                {instance.caption ? (instance.caption.length == 0 ? 'no caption' : instance.caption) : 'no caption'}
            </div>
            <div className={s.comments}>
                {
                    instance.comments.length > 0 ?
                        <div className={s.expand} onClick={() => setExpanded(!expanded)}>
                            {expanded ? '⬆ collapse comments' : '⬇ expand comments'}
                        </div>
                        :
                        <div className={s.expand}></div>
                }
                {
                    expanded ?
                        instance.comments.map((comment) => {
                            return (
                                <div className={s.comment} key={comment.comment_id}>
                                    <Link href={`/profile/${comment.owner.uid}`}>
                                        <img src={comment.owner.pfp} className={s.commentpfp} />
                                    </Link>
                                    <div className={s.discourse}>
                                        <Link href={`/profile/${comment.owner.uid}`}>
                                            <div className={s.username}>@{comment.owner.username}</div>
                                        </Link>
                                        <div className={s.convo}>{comment.text}</div>
                                    </div>
                                </div>
                            )
                        })
                        : null
                }
            </div>

        </div>



    )
}