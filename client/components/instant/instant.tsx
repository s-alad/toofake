import Instance from "@/models/instance";

import s from './instant.module.scss';
import l from '@/styles/loader.module.scss';
import Draggable from "react-draggable";
import { createRef, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowCircleRight, faArrowLeft, faArrowRight, faCaretDown, faCaretLeft, faCaretRight, faCaretUp, faCheck, faCross, faDownload, faFaceFrown, faFaceSadCry, faFaceSmile, faPlusCircle, faTrashCan, faPlayCircle } from "@fortawesome/free-solid-svg-icons";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Moji from "@/models/moji";

interface _Instant {
    instance: Instance,
    mymojis: Moji[]
}

export default function Instant({ instance, mymojis }: _Instant) {
    console.log(instance.user.uid)

    let router = useRouter();

    let [comment, setComment] = useState<string>("");
    let [commentLoading, setCommentLoading] = useState<boolean>(false);
    let [location, setLocation] = useState<string>("loading...");

    function sendComment() {
        setCommentLoading(true);

        let token = localStorage.getItem("token");
        let body = JSON.stringify({ 
            "token": token, 
            "instance_id": instance.instanceid, 
            "poster_user_id": instance.user.uid,
            "comment": comment
        });

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
        ).catch((error) => { console.log(error); setCommentLoading(false); })
    }

    function deletepost() {
        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });

        let options = {
            url: `/api/delete`,
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data);
                router.reload();
            }
        ).catch((error) => { console.log(error); })

    }

    function viewBts() {
        window.open(instance.btsMedia, "_blank")?.focus();
    }

    let [swap, setSwap] = useState<boolean>(true);
    let [expanded, setExpanded] = useState<boolean>(false);

    let profile_link = instance.user.uid == localStorage.getItem("uid") ? "/me" : `/profile/${instance.user.uid}`;

    function pfp(): JSX.Element {
        if (instance.user.pfp) { return <img src={instance.user.pfp} /> }
        else { return <div className={s.letter}>{instance.user.username.toUpperCase().charAt(0)}</div> }
    }

    async function getLocation() {

        if (instance.location == undefined) {
            setLocation("No location data");
            return;
        }

        let lat = instance.location.latitude;
        let long = instance.location.longitude;
        /* console.log(lat, long); */

        try {
            let response = await axios.get(
                `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${long},${lat}&outSR=&forStorage=false&f=pjson`
            )
            /* console.log(response.data) */
            setLocation(response.data.address.Address + ", " + response.data.address.City)
        } catch (error) {
            console.log(error);
            setLocation("No location data");
        }
    }
    
    let [reactionSuccess, setReactionSuccess] = useState<boolean>(false);
    let [reactionFailure, setReactionFailure] = useState<boolean>(false);
    let [addingmoji, setAddingmoji] = useState<boolean>(false);
    let [reactionLoading, setReactionLoading] = useState<boolean>(false);
    async function reactionHandler(emoji: Moji) {
        setAddingmoji(false);
        setReactionLoading(true)

        let token = localStorage.getItem("token");
        let post_id = instance.instanceid;
        let post_user_id = instance.user.uid;

        let body = JSON.stringify({ "token": token, "post_id": post_id, "post_user_id": post_user_id, "emoji": emoji.emoji });

        let options = {
            url: "/api/react",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data);
                setReactionLoading(false);
                setReactionSuccess(true);
                setTimeout(() => { setReactionSuccess(false); router.reload() }, 2000);
            }
        ).catch((error) => { 
            console.log(error); 
            setReactionLoading(false); 
            setReactionFailure(true); 
            setTimeout(() => { setReactionFailure(false) }, 2000);
        })
    }

    function getReactionState(): JSX.Element {
        if (reactionSuccess) {
            return <FontAwesomeIcon icon={faCheck} />
        } else if (reactionFailure) {
            return <FontAwesomeIcon icon={faCross} />
        } else {
            return <FontAwesomeIcon icon={!addingmoji ? faFaceSmile : faFaceFrown} onClick={() => setAddingmoji(!addingmoji)} />
        }
    }

    function downloadSecondary() {
        let link = document.createElement('a');
        link.target = '_blank';
        link.href = swap ? instance.secondary : instance.primary;
        link.download = 'primary.png';
        document.body.appendChild(link);

        let link2 = document.createElement('a');
        link2.target = '_blank';
        link2.href = swap ? instance.primary : instance.secondary;
        link2.download = 'secondary.png';

        document.body.appendChild(link);
        document.body.appendChild(link2);

        link.click();
        link2.click();
        
        document.body.removeChild(link);
        document.body.removeChild(link2);
    }

    useEffect(() => {
        getLocation();
    }, [])

    let carouselRef = createRef<Carousel>();

    return (
        <div className={s.instant}>

            <div className={s.top}>
                <div className={s.pfp}>
                    <Link href={profile_link}>{pfp()}</Link>
                </div>
                <div className={s.details}>
                    <div className={s.username}><Link href={profile_link}> @{instance.user.username} </Link></div>
                    <div className={s.location}> {location} </div>
                    <div className={s.timeposted}>{instance.creationdate}</div>
                </div>
                {
                    instance.user.uid == localStorage.getItem("uid") ?
                        <div className={s.trash} onClick={deletepost} title="Click to delete">
                            <FontAwesomeIcon icon={faTrashCan} />
                        </div>
                        :
                        <div className={s.trash} title="Click to react">
                            {
                                reactionLoading ?
                                    <div className={s.addloading}><div className={l.loadersmall}></div></div> :
                                    getReactionState()
                            }
                        </div>
                }
                {
                    instance.btsMedia != undefined ? 
                    <div className={s.btsView} onClick={viewBts} title="Click to view the BTS">
                        <FontAwesomeIcon icon={faPlayCircle} />
                    </div>
                    :
                    <div></div>
                }
            </div>

            <div className={s.content}>
                <img src={swap ? instance.primary : instance.secondary} className={s.primary} onClick={() => setSwap(!swap)}/>
                <div className={s.bounds} onClick={() => setSwap(!swap)} onMouseDown={(e) => { e.stopPropagation() }}>
                    <Draggable axis="both" bounds="parent" >
                        <img src={swap ? instance.secondary : instance.primary} className={s.secondary}  />
                    </Draggable>
                </div>
                {
                    !addingmoji ?
                        <div className={s.realmojis}>
                            {
                                instance.realmojis.length > 5 ?
                                    <div className={s.nextlast}>
                                        <div className={s.add} onClick={() => carouselRef.current?.previous(carouselRef.current.state.currentSlide)}>
                                            <FontAwesomeIcon icon={faCaretLeft} />
                                        </div>
                                    </div>
                                    : null
                            }
                            {
                                <Carousel
                                    responsive={{
                                        main: {
                                            breakpoint: {
                                                max: 3000,
                                                min: 1
                                            },
                                            items: 5,
                                        },
                                    }}
                                    className={s.carousel}
                                    slidesToSlide={2}
                                    draggable
                                    swipeable
                                    renderButtonGroupOutside

                                    arrows={false}
                                    ref={carouselRef}
                                >
                                    {
                                        instance.realmojis.map((realmoji) => {
                                            return (
                                                <Link
                                                    href={realmoji.owner.uid == localStorage.getItem("uid") ?
                                                        "/me" : `/profile/${realmoji.owner.uid}`
                                                    }
                                                    key={realmoji.emoji_id}
                                                >
                                                    <div className={s.realmoji} key={realmoji.emoji_id}>
                                                        <div className={s.moji}>{realmoji.emoji}</div>
                                                        <img src={realmoji.uri} />
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </Carousel>
                            }
                            {
                                instance.realmojis.length > 5 ?
                                    <div className={s.nextlast}>
                                        <div className={s.add} onClick={() => carouselRef.current?.next(carouselRef.current.state.currentSlide)}>
                                            <FontAwesomeIcon icon={faCaretRight} />
                                        </div>
                                    </div> : null
                            }
                        </div>
                        :
                        <div className={s.realmojis}>
                            {/* <div className={s.addmojis}>
                                <div className={s.moji}>⚡</div>
                                <div className={s.add}>
                                    <FontAwesomeIcon icon={faAdd} />
                                </div>
                            </div> */}
                            {
                                mymojis != undefined ? mymojis.map((emoji) => {
                                    return (
                                        <div className={s.addmojis} key={emoji.id} onClick={() => reactionHandler(emoji)}>
                                            <div className={s.moji}>{emoji.emoji}</div>
                                            <img src={emoji.url} />
                                        </div>
                                    )
                                }
                                ) : 'nil'
                            }
                        </div>
                }
            </div>

            <div className={s.caption}>
                {instance.caption ? (instance.caption.length == 0 ? <span>no caption</span> : instance.caption) : <span>no caption</span>}
            </div>
            <div className={s.addcomment}>
                <input placeholder="your comment" value={comment} onChange={(e) => { setComment(e.target.value); }}></input>
                {
                    commentLoading ?
                        <div className={s.addloading}><div className={l.loadersmall}></div></div>
                        :
                        <button onClick={sendComment}>add</button>
                }
            </div>
            <div className={s.comments}>
                {
                    <div className={s.download}>
                        <FontAwesomeIcon icon={faDownload} onClick={downloadSecondary}/>
                    </div>
                }
                {
                    instance.comments.length > 0 ?
                        <div className={s.expand} >
                            <span className={s.click} onClick={() => setExpanded(!expanded)}>
                                {
                                    !expanded ? 
                                    <> <FontAwesomeIcon icon={faCaretDown} />  expand comments</>
                                    : <> <FontAwesomeIcon icon={faCaretUp} />  collapse comments</>}
                            </span>
                        </div>
                        :
                        <div className={s.holder}>no comments</div>
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