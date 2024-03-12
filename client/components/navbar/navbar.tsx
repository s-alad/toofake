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
        } else if (router.pathname == "/memories") {
            return "memories";
        } else if (router.pathname == "/realmojis") {
            return "realmojis";
        } else if (router.pathname == "/") {
            return "login";
        } else if (router.pathname.startsWith("/help")) {
            return "help";
        }
    }

    let [menu, setMenu] = React.useState<boolean>(false);

    // if width greater than 800px, show desktop navbar
    // if width less than 800px, show mobile navbar

    // super hacky navbar but works for now
    return (
        <nav className={s.toofake}>
            <div className={s.navigation}>
                {
                    !menu ?
                        <>
                            <Link href={"/feed"} className={s.fake}>
                                <div className={s.fake}>TooFake</div>
                            </Link>
                            <div className={s.sep}></div>
                            <div className={s.pagename}>
                                {getPageName()}
                            </div>
                        </> :
                        <div className={s.extra}>
                            <div className={s.fake}>&nbsp;</div>
                            {/* <div className={s.sep}></div> */}
                            <span className={s.logout}>
                                <button onClick={() => { logout(router, localStorage); setMenu(false) }}>logout</button>
                            </span>
                            <Link href={"/post"} className={s.logout}>
                                <button>post</button>
                            </Link>
                            <Link href={"/memories"} className={s.logout}>
                                <button>memories</button>
                            </Link>
                            <Link href={"/realmojis"} className={s.logout}>
                                <button>mojis</button>
                            </Link>
                        </div>
                }

                <div className={s.actions} >
                    {
                        router.pathname == "/feed"
                            ?
                            <>
                                <Link href={'/memories'} className={s.item}>
                                    <button >memories</button>
                                </Link>
                                <Link href={'/realmojis'} className={s.item}>
                                    <button >realmojis</button>
                                </Link>
                                <span className={s.item}>
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
                            router.pathname == "/" ?
                                <>
                                    <Link href="/help" className={s.item}><button>about</button></Link>
                                    <Link href="/help#how-to-use" className={s.item}><button>help</button></Link>
                                    <Link href="/help#FAQ" className={s.item}><button>faq</button></Link>
                                </>
                                :
                                <Link href={"/feed"} className={s.post} >
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
                            :
                            (
                                router.pathname == "/" ?
                                    <div className={s.helpmobile}>
                                        <Link href="/help" className={""}>about</Link>
                                        <Link href="/help#how-to-use" className={""}>help</Link>
                                        <Link href="/help#FAQ" className={""}>faq</Link>
                                    </div>
                                    :
                                    (
                                        router.pathname.startsWith("/help") ?
                                            <>

                                                <Link href={"/feed"}>
                                                    <button>back</button>
                                                </Link>
                                            </> :
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
                                    )
                            )
                    }
                </div>
            </div>
        </nav>
    )
}