import Instance from "@/models/instance";

import s from './instant.module.scss';
import l from '@/styles/loader.module.scss';
import Draggable from "react-draggable";
import { createRef, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowCircleRight, faArrowLeft, faArrowRight, faCaretLeft, faCaretRight, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface _Instant {
    instance: Instance;
}

export default function Instant({ instance }: _Instant) {

    let router = useRouter();

    let [comment, setComment] = useState<string>("");
    let [commentLoading, setCommentLoading] = useState<boolean>(false);
    let [location, setLocation] = useState<string>("loading...");

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

    let [swap, setSwap] = useState<boolean>(false);
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
        console.log(lat, long);

        try {
            let response = await axios.get(
                `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${long},${lat}&outSR=&forStorage=false&f=pjson`
            )
            console.log(response.data)
            setLocation(response.data.address.Address + ", " + response.data.address.City)
        } catch (error) {
            console.log(error);
            setLocation("No location data");
        }
    }

    useEffect(() => {
        getLocation();



    }, [])

    let [mymojis, setMymojis] = useState<string[]>([]);
    let [addingmoji, setAddingmoji] = useState<boolean>(false);

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
                </div>
                {
                    instance.user.uid == localStorage.getItem("uid") ?
                        <div className={s.trash} onClick={deletepost}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </div> : null
                }
            </div>

            <div className={s.content}>
                <img src={swap ? instance.primary : instance.secondary} className={s.primary} />
                <div className={s.bounds} onClick={() => setSwap(!swap)}>
                    <Draggable axis="both" bounds="parent" >
                        <img src={swap ? instance.secondary : instance.primary} className={s.secondary} onClick={() => setSwap(!swap)} onMouseDown={(e) => { e.stopPropagation() }} />
                    </Draggable>
                </div>
                <div className={s.realmojis}>
                    {/* <div className={s.addmojis}>
                        <div className={s.add} onClick={() => setAddingmoji(!addingmoji)}>
                            <FontAwesomeIcon icon={faAdd} />
                        </div>
                    </div> */}
                        
                        {    instance.realmojis.length > 5 ?
                        <div className={s.nextlast}>
                            <div className={s.add} onClick={() => carouselRef.current?.previous(carouselRef.current.state.currentSlide)}>
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </div>
                            </div>
                            : null
                        }
                    {
                        !addingmoji ?
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
                            :
                            <>
                                <div className={s.addmojis}>
                                    <div className={s.moji}>⚡</div>
                                    <div className={s.add}>
                                        <FontAwesomeIcon icon={faAdd} />
                                    </div>
                                </div>
                            </>
                    }
                    {
                        instance.realmojis.length > 5 ?
                        <div className={s.nextlast}>
                            <div className={s.add} onClick={() => carouselRef.current?.next(carouselRef.current.state.currentSlide)}>
                                <FontAwesomeIcon icon={faCaretRight} />
                            </div>
                        </div>
                            :
                            null
                    }
                </div>
            </div>

            <div className={s.caption}>
                {instance.caption ? (instance.caption.length == 0 ? 'no caption' : instance.caption) : 'no caption'}
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
                    instance.comments.length > 0 ?
                        <div className={s.expand} onClick={() => setExpanded(!expanded)}>
                            {expanded ? '⬆ collapse comments' : '⬇ expand comments'}
                        </div>
                        :
                        <div className={s.holder}></div>
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