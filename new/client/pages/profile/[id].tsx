import axios from 'axios';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import s from './profile.module.scss'

export default function Profile() {
    const router = useRouter()

    let [username, setUsername] = useState<string>("");
    let [name, setName] = useState<string>("");
    let [bio, setBio] = useState<string>("");
    let [pfp, setPfp] = useState<string>("");
    let [status, setStatus] = useState<string>("");

    useEffect(() => {

        if (!router.isReady) return;

        console.log("router.query.id")
        console.log(router.query.id)

        let rid = router.query.id;

        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token, "profile_id": rid });
        let options = {
            url: "/api/profile",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data);
                setUsername(response.data.username);
                setName(response.data.fullname);
                setBio(response.data.biography != undefined ? response.data.biography : "");
                setPfp(response.data.profilePicture != undefined ? response.data.profilePicture.url : "");
                setStatus(response.data.relationship.status);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }, [router.isReady])
    return (
        <div className={s.me}>
            <div className={s.card}>
                {pfp ? <img src={pfp} className={s.pfp} /> : <div className={s.pfp}>no profile picture</div>}
                <div className={s.details}>
                    <div className={s.detail}>
                        <div className={s.label}>username</div>
                        <div className={s.value}>{username}</div>
                    </div>
                    <div className={s.detail}>
                        <div className={s.label}>name</div>
                        <div className={s.value}>{name}</div>
                    </div>
                    {
                        bio.length > 0 ?
                            <div className={s.detail}>
                                <div className={s.label}>biography</div>
                                <div className={s.value}>{bio}</div>
                            </div> : null
                    }
                    <div className={s.detail}>
                        <div className={s.label}>relation</div>
                        <div className={s.value}>{status == "accepted" ? "friends" : "stranger"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}