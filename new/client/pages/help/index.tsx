import React from "react";

import s from "./help.module.scss";

/* import { useTranslation } from 'next-i18next' */

export default function Help() {


    /* const { t, i18n } = useTranslation() */

    return (
        <div className={s.help}>

            <div className={s.brief}>
                Hello there! 😄 <br />
                <p>If you're here you're probably interested in not using BeReal in the way it was intended to be used, and to be honest thats why I mainly started this project too! Don't worry, there's no judgment ;)</p>
                <p>With TooFake, you can view friends' BeReals without posting your own. You can post custom images. You can add custom reactions and react to posts. You can also comment & react to posts without posting. You can also screenshot and download BeReals without being detected.</p>
                <p>This project is completely <a href="https://github.com/s-alad/toofake">open source</a> and still a work in progress. There are many issues that I know of and others that I don't know of; feel free to reach out with bugs or if you'd like to contribute! </p>
                <p>It's based on a lot of the great work done at Notmarek's <a href="https://github.com/notmarek/BeFake/tree/master">BeFake</a> and inspired by <a href='https://shomil.me/bereal/'>shomil</a>. Go show them some support!</p>
                <p>BeReal continuously changes their code which sometimes breaks this project. I'll try to keep a status up on the homepage.</p>
                <p>- 🥗</p>
            </div>

            <div className={s.directory}>
                <a href="#FAQ">FAQ</a>
                <a href="#how-to-use">How To Use</a>
                <a href="#common-issues">Common Issues</a>
            </div>

            <div className={s.faq} id="FAQ">
                <h2>FAQ</h2>
                <div className={s.qa}>
                    <div className={s.q}>
                        <h3>Will I get banned from BeReal</h3>
                        <p>TooFake, the BeFake project, and the old BeFake website have been running for over 10 months without anybody getting banned. Trends show you are safe! But as with everything there's always a small risk.</p>
                    </div>
                    <div className={s.q}>
                        <h3>Is TooFake safe?</h3>
                        <p>TooFake is completely open source; you can check out the code here. It doesn't save any of your credentials. If you are uncomfortable using this client, you can run a local instance aswell!</p>
                    </div>
                    <div className={s.q}>
                        <h3>Why can't I login?</h3>
                        <p>Logging in should currently be working. TooFake tries to log you in two times with two different BeReal providers; if both fail then there might be an issue I don't know of. Try refreshing the website and trying again.</p>
                    </div>
                    <div className={s.q}>
                        <h3>Can I screenshot or download friends' BeReals?</h3>
                        <p>Yes, you can take screenshots without notifying your friends. You can also press the download button on the bottom right of a BeReal to download the primary image</p>
                    </div>
                    <div className={s.q}>
                        <h3>Why does the website crash when I try to post images?</h3>
                        <p>If the images you are posting are .heic, .heif, (iphone images) or .webp images, the website will crash as it currently does not support those. Please try converting them or taking a screenshot of the photos and posting those.</p>
                    </div>
                    <div className={s.q}>
                        <h3>Why does the page I'm at go entirely black or have a client side exception?</h3>
                        <p>This might happen if there is some error that arises that we haven't handled. Please refresh the page or re-login</p>
                    </div>
                </div>
            </div>

            <div className={s.use} id="how-to-use">
                <h2>How To Use</h2>
                <div className={s.uses}>
                    <div className={s.use}>
                        <h3>Logging in</h3>
                        <p>Login by navigating to toofake.lol and entering your phone number. After that it will try to send a code using two providers, if one fails you'll see red and blue text notifying you it is trying the second. You should recieve a code. Enter the code and press enter once. You'll hopefully be redirected to the homepage where you can view BeReals.</p>
                    </div>
                    <div className={s.use}>
                        <h3>Viewing BeReals</h3>
                        <p>After logging in, you should see all your friends BeReals. On a computer, you can click any of the images to swap them, and drag the images around. On mobile, click the big image to swap it to the small one.</p>
                    </div>
                    <div className={s.use}>
                        <h3>Posting BeReals</h3>
                        <p>You can post BeReals by clicking post on the navigation menu. Select your primary and secondary image and add a caption. Submit the image and hopefully it'll get posted. Posting does not support iphone images (.heic & .heif) or .webp images as of yet.</p>
                    </div>
                    <div className={s.use}>
                        <h3>Reacting to BeReals</h3>
                        <p>You can react to BeReals by clicking the smiley reaction face at the top right of a BeReal next to the username. This will show you your current reactions that you have. Click one to submit it, you'll see a loading sign and a check if it works or an X if it fails.</p>
                    </div>
                    <div className={s.use}>
                        <h3>Adding custom Reactions</h3>
                        <div>You can add custom reactions by navigating to the realmojis menu on the navigation menu. You'll see your current reactions alongside the emoji theyre associated with. Click on select a new reaction to submit an image, then click the send button that pops up. Hopefully your reaction will get added. You'll see a loading symbol and a check if it works. <br />NOTE: It may take a minuite or two for your reactions to start showing</div>
                    </div>
                </div>
            </div>

            <div className={s.issues} id="common-issues">
                <h2>Common Issues</h2>
            </div>

            

        </div>
    )
}