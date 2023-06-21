import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import s from './index.module.scss'
import axios from "axios";
import { useState } from 'react';
import { generateDeviceId } from '@/utils/device'
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/bootstrap.css";
import { useRouter } from 'next/router'
import useCheck from '@/utils/check'
import myself from '@/utils/myself'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	useCheck();

	let router = useRouter();

	let [vonageid, setVonageid] = useState<string>("");
	let [inputNumber, setInputNumber] = useState<string>("");
	let [inputOTP, setInputOTP] = useState<string>("");
	let [requestedOtp, setRequestedOtp] = useState<boolean>(false);
	let [failed, setFailed] = useState<string>("");


	function failure(response: any) {
		let status = response.status;
		let text = response.statusText;
		let errorkey = response.data.error.errorKey ?? "";
		
		setFailed("ERROR | " + status + " " + text + " | " + errorkey);
		setTimeout(() => {setFailed("");}, 3000);
	}


	async function verifyOTPVonage(otp: string) {
		console.log("client verify otp: ", otp, " vonageid: ", vonageid);

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
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("refresh_token", response.data.refresh_token);
				localStorage.setItem("expiration", response.data.expiration)
				localStorage.setItem("uid", response.data.uid);
				localStorage.setItem("is_new_user", response.data.is_new_user);
				localStorage.setItem("token_type", response.data.token_type);
				await myself();
				router.push("/feed");
			}
		).catch((error) => {failure(error.response);})		
	}

	async function requestOTPFirebase(number: string) {
		console.log("client firebase request otp");
		console.log(number);
		console.log("------------------")

		let body = JSON.stringify({ "number": number })
		let options = {
			url: "/api/otp/alternate",
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			data: body,
		}

		let response = axios.request(options).then(
			(response) => {
				if (response.status == 200) {
					let rstatus = response.data.status;
					let rvonageid = response.data.session_info;
					console.log(response.data);
					setVonageid(rvonageid);
					setRequestedOtp(true);
				} else {
					console.log(response.data);
				}
			}
		).catch(
			(error) => {
				console.log(error.response);
			}
		)
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

		let response = axios.request(options).then(
			(response) => {
				let rvonageid = response.data.vonageRequestId;
				console.log(response.data);
				setVonageid(rvonageid);
				setRequestedOtp(true);
			}
		).catch((error) => {failure(error.response);})
	}


	return (
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
						<button className={s.send} onClick={() => requestOTPVonage(inputNumber)}>
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
						<button className={s.send} onClick={() => verifyOTPVonage(inputOTP)}>
							send
						</button>
					</div>
				</div>
			}
			{
				failed != "" ?
				<div className={s.failed}>
					{failed}
				</div> : ""
			}
		</div>
	)
}
