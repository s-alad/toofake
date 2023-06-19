import Instance from "@/models/instance";

import s from './instant.module.scss';
import Draggable from "react-draggable";
import { useState } from "react";

interface _Instant {
    instance: Instance;
}

export default function Instant({ instance }: _Instant) {

    let [swap, setSwap] = useState<boolean>(false);
    let [expanded, setExpanded] = useState<boolean>(false);

    console.log("instance")
    console.log(instance);

    return (
        <div className={s.instant}>

            <div className={s.top}>
                <div className={s.pfp}>
                    <img src={instance.user.pfp} />
                </div>
                <div className={s.details}>
                    <div className={s.username}> @{instance.user.username} </div>
                    <div className={s.location}> {instance.location} </div>
                </div> 
            </div>

            <div className={s.content}>
                <img src={swap ? instance.primary : instance.secondary} className={s.primary}/>
                <div className={s.bounds}>
                    <Draggable axis="both" bounds="parent">
                        <img src={swap ? instance.secondary : instance.primary} className={s.secondary} onClick={() => setSwap(!swap)}/>
                    </Draggable>
                </div>
                <div className={s.realmojis}>
                    {
                        instance.realmojis.map((realmoji) => {
                            return (
                                <div className={s.realmoji} key={realmoji.emoji_id}>
                                    <div className={s.moji}>{realmoji.emoji}</div>
                                    <img src={realmoji.uri} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className={s.caption}>
                {instance.caption}
            </div>
            <div className={s.comments}>
                {
                    instance.comments.length > 0 ?
                    <div className={s.expand} onClick={() => setExpanded(!expanded)}>expand comments</div>
                    : null
                }
                {
                    expanded ?
                    instance.comments.map((comment) => {
                        return (
                            <div className={s.comment} key={comment.comment_id}>
                                <div className={s.username}>@{comment.owner.username}</div>
                                <div className={s.commenttext}>{comment.text}</div>
                            </div>
                        )
                    })
                    : null
                }
            </div>
            
        </div>



    )
}