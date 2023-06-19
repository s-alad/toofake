import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import s from './index.module.css'
import axios from "axios";
import { useState } from 'react';
import { generateDeviceId } from '@/utils/device'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	let [vonageid, setVonageid] = useState<string>("");

	async function verifyOTPVonage(otp: string) {
		console.log("client verify otp");
		console.log(otp, vonageid);
		console.log("------------------")
		let body = JSON.stringify({"code": otp, "vonageRequestId": vonageid});
		let options = {
			url: "/api/otp/verify",
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			data: body,
		}

		let response = await axios.request(options)
		let token = response.data.token;
		let uid = response.data.uid;
		let refresh_token = response.data.refresh_token;
		let is_new_user = response.data.is_new_user;
		let token_type = response.data.token_type;

		console.log(response.data);

		if (localStorage.getItem("token") != null) {
			localStorage.removeItem("token");
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("uid");
			localStorage.removeItem("is_new_user");
			localStorage.removeItem("token_type");
		}
		localStorage.setItem("token", token);
		localStorage.setItem("refresh_token", refresh_token);
		localStorage.setItem("uid", uid);
		localStorage.setItem("is_new_user", is_new_user);
		localStorage.setItem("token_type", token_type);
	}

	async function requestOTPVonage(number: string) {
		console.log("client request otp");
		console.log(number);
		console.log("------------------")

		let body = JSON.stringify({"number": number})
		let options = {
			url: "/api/otp/send",
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			data: body,
		}

		let response = await axios.request(options)

		if (response.status == 200) {
			let rstatus = response.data.status;
			let rvonageid = response.data.vonageRequestId;
			console.log(response.data);
			setVonageid(rvonageid);
		} else {
			console.log(response.data);
		}
	}

	let [inputNumber, setInputNumber] = useState<string>("");
	let [inputOTP, setInputOTP] = useState<string>("");

	return (
		<>
			<Head>
				<title>TooFake</title>
				<meta name="description" content="" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={`${styles.main} ${inter.className}`}>
				<h1 className={s.title}>TooFake</h1>

				<div className={s.phonenumber}>
					<input type="text" placeholder="phone number" onChange={(event) => { setInputNumber(event.target.value); }} />
					<button onClick={() => requestOTPVonage(inputNumber)}>send otp</button>
				</div>

				<div className={s.phoneotp}>
					<input type="text" placeholder="otp" onChange={(event) => { setInputOTP(event.target.value); }} />
					<button onClick={() => verifyOTPVonage(inputOTP)}>verify otp</button>
				</div>
			</main>
		</>
	)
}
