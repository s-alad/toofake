import React, { useEffect } from 'react'
import s from './navbar.module.scss'

import { useRouter } from 'next/router'
import Link from 'next/link';

export default function Navbar() {

    let router = useRouter();

    let [pfp, setPfp] = React.useState<string>("");

    useEffect(() => {
        if (localStorage && JSON.parse(localStorage.getItem("myself")!).profilePicture) {
            setPfp(JSON.parse(localStorage.getItem("myself")!).profilePicture.url);
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
                            <Link href={"/post"} className={s.post}>
                                <button>post</button>
                            </Link>
                            <div className={s.sep}></div>
                            <Link href={"/me"}>
                                <img src={pfp}/>
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