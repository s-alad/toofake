import React from 'react';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/bootstrap.css";
import './login.css';

function Login(props:any) {

    const [unverified, setUnverified] = useState(true);
    const [info, setInfo] = useState('')
    const [data, setData] = useState('')

    const [valid, setValid] = useState(true);
    const [telephone, setTelephone] = useState('');
    const [passcode, setPasscode] = useState('');

    function check(number: string) {
        console.log(number)
        console.log(number.length)
        if (number.length <= 11 || number.length > 16) {
            setValid(false);
            //wait 5 seconds then reset
            setTimeout(() => {
                setValid(true);
            }, 3000);
        }
        else {verify(telephone)}
    }

    function verify(number: string) {
        console.log(number)
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
                localStorage.setItem('uid', data['localId'])
                localStorage.setItem('phoneNumber', data['phoneNumber'])
                localStorage.setItem('expiration', (Date.now() + parseInt(data['expiresIn']) * 1000).toString())
                setData(JSON.stringify(data))

                if (data["phoneNumber"] === telephone) {
                    console.log('authenticating')
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
                            value={telephone}
                            onChange={phone => setTelephone('+'+phone)}
                            inputClass='digits'
                            dropdownClass='dropdown'
                            searchClass='search'
                            buttonClass='button'
                            containerClass='cont'
                        />
                       {/*  <input className='digits' onChange={(e) => setTelephone(e.target.value)} value={telephone} placeholder={'+1xxxyyyzzzz'}></input> */}
                        <button className='send' onClick={() => check(telephone)}>
                            send
                        </button>
                    </div>

                    <div className='error'>
                        {
                            valid ? '' : <div className='err'>invalid phone number</div>
                        }
                    </div>
                </div>
                :
                <div className='verify'>
                    <div className='text'>
                        enter the one time passcode
                    </div>
                    <div className='number'>
                        <input className='digits space' onChange={(e) => setPasscode(e.target.value)} value={passcode} placeholder={'000111'}></input>
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