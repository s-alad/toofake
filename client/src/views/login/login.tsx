import React from 'react';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/bootstrap.css";
import './login.css';

function Login(props:any) {

    const [unverified, setUnverified] = useState(true);
    const [info, setInfo] = useState('')
    const [data, setData] = useState('')

    const [phone, setPhone] = useState('');

    const [telephone, setTelephone] = useState('');
    const [passcode, setPasscode] = useState('');

    function handleTele(p: any) {
        setTelephone('+'+p)
    }
    function printTele() {
        console.log(telephone)
    }

    function verify(number: string) {
        fetch(`/sendotp/${number}`).then(
            (value) => {return value.json()}
        ).then(
            (data) => {
                setInfo(data['sessionInfo'])
                console.log(info)
            }
        ).catch((e) => console.log(e))

        setUnverified(!unverified);
    }

    function handle(passcode: string) {
        fetch(`/verifyotp/${passcode}/${info}`).then(
            (value) => {return value.json()}
        ).then(
            (data) => {
                console.log(data)
                localStorage.setItem('token', JSON.stringify(data))
                localStorage.setItem('idtoken', data['idToken'])
                localStorage.setItem('refresh', data['refreshToken'])
                localStorage.setItem('expiration', (Date.now() + parseInt(data['expiresIn']) * 1000).toString())
                setData(JSON.stringify(data))

                if (data["phoneNumber"] === telephone) {
                    props.auth()
                }
            }
        ).catch((e) => console.log(e))
    }

    return (
        <div>
            {
                unverified ?
                <div className='login'>
                    <div className='text'>
                        login using your phone number
                    </div>
                    
                    <div className='number'>
                        <PhoneInput
                            placeholder={'xxxyyyzzzz'}
                            enableSearch={true}
                            country={'us'}
                            value={phone}
                            onChange={phone => handleTele(phone)}
                            inputClass='digits'
                            dropdownClass='dropdown'
                            searchClass='search'
                            buttonClass='button'
                            containerClass='cont'
                        />
                       {/*  <input className='digits' onChange={(e) => setTelephone(e.target.value)} value={telephone} placeholder={'+1xxxyyyzzzz'}></input> */}
                        <button className='send' onClick={() => verify(telephone)}>
                            send
                        </button>
                    </div>
                </div>
                :
                <div className='verify'>
                    <div className='text'>
                        enter the one time passcode
                    </div>
                    <div className='number'>
                        <input className='digits' onChange={(e) => setPasscode(e.target.value)} value={passcode} placeholder={'000111'}></input>
                        <button className='send' onClick={() => handle(passcode)}>
                            send
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Login;