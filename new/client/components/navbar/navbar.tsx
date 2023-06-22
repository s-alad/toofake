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

    function getPageName() {
        if (router.pathname == "/feed") {
            return "feed";
        } else if (router.pathname == "/me") {
            return "me";
        } else if (router.pathname == "/post") {
            return "post";
        } else if (router.pathname.startsWith("/profile")) {
            return "profile";
        }
    }

    let [menu, setMenu] = React.useState<boolean>(false);


    // super hacky navbar but works for now
    return (
        <nav className={s.toofake}>
            <div className={s.navigation}>
                {
                    !menu ?
                        <>
                            <div className={s.fake}>TooFake</div>
                            <div className={s.sep}></div>
                            <div className={s.pagename}>
                                {getPageName()}
                            </div>
                        </> :
                        <div className={s.extra}>
                            <div className={s.fake}>&nbsp;</div>
                            <div className={s.sep}></div>
                            <span className={s.logout}>
                                <button onClick={() => {logout(router, localStorage); setMenu(false)}}>logout</button>
                            </span>
                            <Link href={"/post"} className={s.logout}>
                                <button>post</button>
                            </Link>
                        </div>
                }

                <div className={s.actions} >
                    {
                        router.pathname == "/feed"
                            ?
                            <>
                                <Link href={'/memories'} className={s.memories}>
                                    <button >memories</button>
                                </Link>
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
                            </>
                            :
                            <Link href={"/feed"}>
                                <button>back</button>
                            </Link>
                    }
                </div>

                <div className={s.mobile}>
                    {
                        router.pathname == "/feed"
                            ?
                            <>
                                <div className={`${s.menu} ${menu ? s.menuopen : ""}`} onClick={() => setMenu(!menu)}>
                                    <div className={s.line}></div>
                                    <div className={s.line}></div>
                                    <div className={s.line}></div>
                                </div>
                                <div className={s.sep}></div>
                                <Link href={"/me"}>
                                    {
                                        pfp ? <img src={pfp} /> : <div className={s.letter}>{username.toUpperCase().charAt(0)}</div>
                                    }
                                </Link>
                            </>
                            : router.pathname == "/" ? "" :
                            <>
                                <div className={`${s.menu} ${menu ? s.menuopen : ""}`} onClick={() => setMenu(!menu)}>
                                    <div className={s.line}></div>
                                    <div className={s.line}></div>
                                    <div className={s.line}></div>
                                </div>
                                <div className={s.sep}></div>
                                <Link href={"/feed"}>
                                    <button>back</button>
                                </Link>
                            </>
                    }
                </div>
            </div>
        </nav>
    )
}