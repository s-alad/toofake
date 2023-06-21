import Instance from "@/models/instance";

import s from './instant.module.scss';
import l from '@/styles/loader.module.scss';
import Draggable from "react-draggable";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

interface _Instant {
    instance: Instance;
}

export default function Instant({ instance }: _Instant) {

    let router = useRouter();

    let [comment, setComment] = useState<string>("");
    let [commentLoading, setCommentLoading] = useState<boolean>(false);
    function sendComment() {
        setCommentLoading(true);

        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token, "instance_id": instance.instanceid, "comment": comment });

        let options = {
            url: "/api/comment",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }
        
        axios.request(options).then(
            (response) => {
                console.log(response.data);
                setComment("");
                setCommentLoading(false);
                router.reload();
            }
        ).catch((error) => {console.log(error); setCommentLoading(false);})
    }

    let [swap, setSwap] = useState<boolean>(false);
    let [expanded, setExpanded] = useState<boolean>(false);

    console.log("instance")
    console.log(instance);

    let profile_link = instance.user.uid == localStorage.getItem("uid") ? "/me" : `/profile/${instance.user.uid}`;

    function pfp(): JSX.Element {
        if (instance.user.pfp) { return <img src={instance.user.pfp} />}
        else { return <div className={s.letter}>{instance.user.username.toUpperCase().charAt(0)}</div> }
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
            <div className={s.addcomment}>
                <input placeholder="your comment" value={comment} onChange={(e) => {setComment(e.target.value);}}></input>
                {
                    commentLoading ? 
                        <div className={s.addloading}><div className={l.loadersmall}></div></div> 
                        : 
                        <button onClick={sendComment}>add</button>
                }
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