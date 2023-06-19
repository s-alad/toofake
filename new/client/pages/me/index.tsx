
import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import useCheck from '@/utils/check';
import myself from '@/utils/myself';

import s from './me.module.scss'

export default function Profile() {

    useCheck();

    let [username, setUsername] = React.useState<string>("");
    let [name, setName] = React.useState<string>("");
    let [bio, setBio] = React.useState<string>("");
    let [pfp, setPfp] = React.useState<string>("");

    useEffect(() => {

        if (localStorage && JSON.parse(localStorage.getItem("myself")!)) {
            setUsername(JSON.parse(localStorage.getItem("myself")!).username);
            setName(JSON.parse(localStorage.getItem("myself")!).fullname);
            setBio(JSON.parse(localStorage.getItem("myself")!).biography);
            setPfp(JSON.parse(localStorage.getItem("myself")!).profilePicture.url);
            return
        }

        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });
        let options = {
            url: "/api/me",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data);
                setUsername(response.data.username);
                setName(response.data.fullname);
                setBio(response.data.biography);
                setPfp(response.data.profilePicture.url);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )

    }, [])

    return (
        <div className={s.me}>
            <div className={s.card}>
                <img src={pfp} className={s.pfp} />
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
                </div>
            </div>


        </div>
    )
}