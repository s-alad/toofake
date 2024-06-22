import Head from 'next/head'
import { Inter } from 'next/font/google'
import Image from 'next/image'
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

export default function Home() {
	useCheck();

	let router = useRouter();

	let [vonageid, setVonageid] = useState<string>("");
	let [firebase_session, set_firebase_session] = useState<string>("");
	let [inputNumber, setInputNumber] = useState<string>("");
	let [inputOTP, setInputOTP] = useState<string>("");
	let [requestedOtp, setRequestedOtp] = useState<boolean>(false);

	let [failed, setFailed] = useState<string>("");
	let [help, setHelp] = useState<string>("");

	function failure(text: string) {
		console.log(text);		
		setFailed(`ERROR: ${text}`);
		setTimeout(() => {setFailed("");}, 4000);
	}

	function helpme() {
		setHelp("Failed with Firebase login provider, re-trying to login with Vonage...");
		setTimeout(() => {setHelp("");}, 4000);
	}


	async function verifyOTPVonage(otp: string) {
		console.log("client vonage verify otp: ", otp, " vonageid: ", vonageid);

		let body = JSON.stringify({ "code": otp, "vonageRequestId": vonageid });
		let options = { 
			url: "/api/otp/vonage/verify", 
			method: "POST", 
			headers: { 'Content-Type': 'application/json' }, 
			data: body,
		}

		let response = axios.request(options).then(
			async (response) => {
				console.log(response.data);
				localStorage.setItem("token", response.data.bereal_access_token);
				localStorage.setItem("firebase_refresh_token", response.data.firebase_refresh_token);
				localStorage.setItem("firebase_id_token", response.data.firebase_id_token)
				localStorage.setItem("expiration", response.data.expiration)
				localStorage.setItem("uid", response.data.uid);
				localStorage.setItem("is_new_user", response.data.is_new_user);
				localStorage.setItem("token_type", response.data.token_type);
				await myself();
				router.push("/feed");
			}
		).catch((error) => {failure((error.response.data.error.error.code + " | "+ error.response.data.error.error.message).toString())})		
	}

	async function requestOTPVonage(number: string) {
		console.log("client vonage request otp");
		console.log(number);
		console.log("------------------")

		let body = JSON.stringify({ "number": number })
		let options = {
			url: "/api/otp/vonage/send",
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			data: body,
		}

		axios.request(options).then(
			(response) => {
				let rvonageid = response.data.vonageRequestId;
				console.log(response.data);
				setVonageid(rvonageid);
				setRequestedOtp(true);
			}
		).catch((error) => {failure("VONAGE REQUEST ERROR: " + JSON.stringify(error.response.data.error));})
	}

	async function verifyOTPFirebase(otp: string) {
		console.log("client firebase verify otp: ", otp, " firebase_session: ", firebase_session);

		let body = JSON.stringify({ "code": otp, "session_info": firebase_session });
		let options = { 
			url: "/api/otp/fire/verify", 
			method: "POST", 
			headers: { 'Content-Type': 'application/json' }, 
			data: body,
		}

		let response = axios.request(options).then(
			async (response) => {
				console.log(response.data);
				localStorage.setItem("token", response.data.bereal_access_token);
				localStorage.setItem("firebase_refresh_token", response.data.firebase_refresh_token);
				localStorage.setItem("firebase_id_token", response.data.firebase_id_token)
				localStorage.setItem("expiration", response.data.expiration)
				localStorage.setItem("uid", response.data.uid);
				localStorage.setItem("is_new_user", response.data.is_new_user);
				localStorage.setItem("token_type", response.data.token_type);
				await myself();
				router.push("/feed");
			}
		).catch((error) => {
			if (error.response) {
				failure("FIREBASE VERIFY ERROR: " + error.response.data.error)
			}else {
				failure("FIREBASE VERIFY ERROR: " + "unknown error, please try re-logging in")
			}
		})
	}

	async function requestOTPFirebase(number: string) {
		console.log("client firebase request otp");
		console.log(number);
		console.log("------------------")

		let body = JSON.stringify({ "number": number })
		let options = {
			url: "/api/otp/fire/send",
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			data: body,
		}

		let response = axios.request(options).then(
			(response) => {
				console.log(response.data);
				let firebase_session = response.data.session_info;
				set_firebase_session(firebase_session);
				setRequestedOtp(true);
			}
		).catch(
			(error) => {
				failure("FIREBASE OTP REQUEST ERROR:" + JSON.stringify(error));
				helpme();
				requestOTPVonage(number);
			}
		)
	}


	return (
		<div className={s.wrapper}>
			<div className={s.log}>
				{
					!requestedOtp ?
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
							<button className={s.send} onClick={() => requestOTPFirebase(inputNumber)}>
								send
							</button>
						</div>
					</div>
					:
					<div className={s.verify}>
						<div className={s.text}>
							enter the one time passcode
						</div>
						<div className={s.number}>
							<input className={`${s.digits} ${s.space}`} onChange={(event) => {setInputOTP(event.target.value);}} placeholder={'000111'}></input>
							<button className={s.send} onClick={() => {
								vonageid != "" ? verifyOTPVonage(inputOTP) : verifyOTPFirebase(inputOTP);
							}}>
								send
							</button>
						</div>
					</div>
				}
				<div className={s.messages}>
					{
						failed != "" ?
						<span className={s.failed}>
							{failed}
						</span> : <span></span>
					}
					{
						help != "" ?
						<div className={s.help}>
							{help}
						</div> : <span></span>
					}
				</div>
			</div>
			<div className={s.info}>
				<p>TooFake is currently working (I think??) but needs <span>your help!!</span></p>
				<p>BeReal continues to beef up its security making it much harder to reverse engineer. If you are well versed in reverse engineering, please check out the <a href="https://github.com/s-alad/toofake"><FontAwesomeIcon icon={faGithub} /> github</a> and help us keep the befake project working!</p>
				{/* <p>You can login using your phone number, view bereals and post custom images.</p>
				<p>Please report any bugs or issues on the <a href="https://github.com/s-alad/toofake"><FontAwesomeIcon icon={faGithub} /> github</a> theres probably a bunch!</p>
				<p>More features coming soon!</p> */}
				{/* <p></p> */}
				{/* <p>- There has been increased reports of login not working in the UK & other countries</p> */}
			</div>
		</div>
	)
}
