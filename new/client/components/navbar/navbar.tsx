import React, { useEffect } from 'react'
import s from './navbar.module.scss'

import { useRouter } from 'next/router'
import Link from 'next/link';
import { logout } from '@/utils/logout';

export default function Navbar() {

    let router = useRouter();

    let [pfp, setPfp] = React.useState<string>("");
    let [username, setUsername] = React.useState<string>("");

    useEffect(() => {
        if (localStorage && JSON.parse(localStorage.getItem("myself")!)) {
            setUsername(JSON.parse(localStorage.getItem("myself")!).username);
            if (JSON.parse(localStorage.getItem("myself")!).profilePicture) {
                setPfp(JSON.parse(localStorage.getItem("myself")!).profilePicture.url);
            }
        }
    }, [router.pathname])
    
    return (
        <nav className={s.toofake}>
            <div>Toofake</div>
            <div className={s.navigation}>
                {
                    router.pathname == "/feed" ? 
                    <> 
                        <div className={s.sep}></div>
                        <div className={s.feed}>
                            Feed
                        </div>
                        <div className={s.profile} >
                            <span className={s.logout}>
                                <button onClick={() => logout(router, localStorage)}>logout</button>
                            </span>
                            <Link href={"/post"} className={s.post}>
                                <button>post</button>
                            </Link>
                            <div className={s.sep}></div>
                            <Link href={"/me"}>
                                {
                                    pfp ? <img src={pfp} /> : <div className={s.letter}>{username.toUpperCase().charAt(0)}</div>    
                                }
                            </Link>
                        </div>
                    </> : ''
                }
                {
                    router.pathname == "/me" || router.pathname.startsWith("/profile") || router.pathname == "/post"? 
                    <> 
                        <div className={s.sep}></div>
                        <div className={s.feed}>
                            {router.pathname == "/post" ? "Post" : "Profile"}
                        </div>
                        <div className={s.profile} >
                            <Link href={"/feed"}>
                                <button>back</button>
                            </Link>
                        </div>
                    </> : ''
                }
                
            </div>
        </nav>
    )
}