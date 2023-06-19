import React from 'react'
import s from './navbar.module.scss'

import { useRouter } from 'next/router'
import Link from 'next/link';

export default function Navbar() {

    let router = useRouter();
    
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
                        <Link className={s.profile} href={"/me"}>
                            <img />
                        </Link>
                    </> : ''
                }
            </div>
        </nav>
    )
}