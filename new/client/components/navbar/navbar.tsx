import React from 'react'
import s from './navbar.module.scss'

import Router from 'next/router'

export default function Navbar() {
    return (
        <nav className={s.toofake}>
            <div>Toofake</div>
            <div className={s.myprofile}>
                
            </div>
        </nav>
    )
}