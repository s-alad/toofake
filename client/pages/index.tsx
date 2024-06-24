import { Inter } from 'next/font/google'
import s from './index.module.scss'
import axios from "axios";
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/bootstrap.css";
import { useRouter } from 'next/router'
import useCheck from '@/utils/check'
import myself from '@/utils/myself'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const inter = Inter({ subsets: ['latin'] })

export default function Home(){
    useCheck();

    let router = useRouter();

    let [vonageId, setVonageId] = useState<string>("");
    let [firebaseSession, setFirebaseSession] = useState<string>("");
    let [inputNumber, setInputNumber] = useState<string>("");
    let [inputOTP, setInputOTP] = useState<string>("");
    let [requestedOtp, setRequestedOtp] = useState<boolean>(false);

    let [failed, setFailed] = useState<string>("");
    let [help, setHelp] = useState<string>("");

    const handleFailure = (text: string) => {
        console.log(text);
        setFailed(`ERROR: ${text}`);
        setTimeout(() => setFailed(""), 4000);
    }

    const handleHelp = (text: string) => {
        setHelp(text);
        setTimeout(() => setHelp(""), 4000);
    }

    const verifyOTP = async (otp: string, provider: 'vonage' | 'firebase') => {
        const url = provider === 'vonage' ? "/api/otp/vonage/verify" : "/api/otp/fire/verify";
        const body = provider === 'vonage' ? { code: otp, vonageRequestId: vonageId } : {
            code: otp,
            session_info: firebaseSession
        };

        try {
            const response = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
            const data = response.data;
            localStorage.setItem("token", data.bereal_access_token);
            localStorage.setItem("firebase_refresh_token", data.firebase_refresh_token);
            localStorage.setItem("firebase_id_token", data.firebase_id_token);
            localStorage.setItem("expiration", data.expiration);
            localStorage.setItem("uid", data.uid);
            localStorage.setItem("is_new_user", data.is_new_user);
            localStorage.setItem("token_type", data.token_type);
            await myself();
            router.push("/feed");
        } catch (error: any) {
            handleFailure(`${provider.toUpperCase()} VERIFY ERROR: ${error.response?.data.error || "unknown error, please try re-logging in"}`);
            if (provider === 'firebase') {
                handleHelp("Failed with Firebase login provider, re-trying to login with Vonage...");
                await requestOTP(inputNumber, 'vonage');
            }
        }
    }

    const requestOTP = async (number: string, provider: 'vonage' | 'firebase') => {
        const url = provider === 'vonage' ? "/api/otp/vonage/send" : "/api/otp/fire/send";
        const body = { number };

        try {
            const response = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
            if (provider === 'vonage') {
                setVonageId(response.data.vonageRequestId);
            } else {
                setFirebaseSession(response.data.session_info);
            }
            setRequestedOtp(true);

        } catch (error: any) {
            handleFailure(`${provider.toUpperCase()} OTP REQUEST ERROR: ${JSON.stringify(error.response?.data.error || error)}`);
            if (provider === 'firebase') {
                handleHelp("Re-trying to login with Vonage...");

                // try to login automatically with vonage if firebase fails
                await requestOTP(number, 'vonage');
            }
        }
    };

    return (
        <div className={s.wrapper}>
            <div className={s.log}>
                {!requestedOtp ? (
                    <div className={s.login}>
                        <div className={s.text}>
                            login using your phone number
                        </div>
                        <div className={s.number}>
                            <PhoneInput
                                placeholder={'xxxyyyzzzz'}
                                enableSearch={true}
                                country={'us'}
                                value={inputNumber}
                                onChange={phone => setInputNumber('+' + phone)}
                                inputClass={s.digits}
                                dropdownClass={s.dropdown}
                                searchClass={s.search}
                                buttonClass={s.button}
                                containerClass={s.cont}
                            />
                            <button className={s.send} onClick={() => requestOTP(inputNumber, 'firebase')}>
                                send
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={s.verify}>
                        <div className={s.text}>
                            enter the one time passcode
                        </div>
                        <div className={s.number}>
                            <input
                                className={`${s.digits} ${s.space}`}
                                onChange={(event) => {
                                    setInputOTP(event.target.value);
                                }}
                                placeholder={'000111'}
                            />
                            <button className={s.send} onClick={() => verifyOTP(inputOTP, vonageId ? 'vonage' : 'firebase')}>
                                send
                            </button>
                        </div>
                    </div>
                )}
                <div className={s.messages}>
                    {failed && <span className={s.failed}>{failed}</span>}
                    {help && <div className={s.help}>{help}</div>}
                </div>
            </div>
            <div className={s.info}>
                <p>TooFake is currently working (I think??) but needs <span>your help!!</span></p>
                <p>BeReal continues to beef up its security making it much harder to reverse engineer. If you are well versed in reverse engineering, please check out the
					<a href="https://github.com/s-alad/toofake"><FontAwesomeIcon icon={faGithub}/> github</a> and help us keep
                    the befake project working!
				</p>
                {/* <p>You can login using your phone number, view bereals and post custom images.</p>
				<p>Please report any bugs or issues on the <a href="https://github.com/s-alad/toofake"><FontAwesomeIcon icon={faGithub} /> github</a> theres probably a bunch!</p>
				<p>More features coming soon!</p> */}
                {/* <p></p> */}
                {/* <p>- There has been increased reports of login not working in the UK & other countries</p> */}
            </div>
        </div>
    );
}
