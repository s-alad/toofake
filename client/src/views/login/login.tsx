import React from 'react';
import { useState } from 'react';
import './login.css';

function Login(props:any) {

    const [unverified, setUnverified] = useState(true);
    const [info, setInfo] = useState('')
    const [data, setData] = useState('')

    const [telephone, setTelephone] = useState('');
    const [passcode, setPasscode] = useState('');

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
                sessionStorage.setItem('token', JSON.stringify(data))
                setData(JSON.stringify(data))

                if (data["phoneNumber"] === telephone) {
                    props.auth()
                }
            }
        ).catch((e) => console.log(e))
        
        console.log('---')
        console.log(data)
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
                        <input className='digits' onChange={(e) => setTelephone(e.target.value)} value={telephone} placeholder={'+1xxxyyyzzzz'}></input>
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