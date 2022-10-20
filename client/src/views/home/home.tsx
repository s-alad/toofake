import Instant from "../../components/instant";
import React, { useEffect } from 'react';
import './home.css';
import { useState } from 'react';

function Home() {

    let token = JSON.parse(sessionStorage.getItem('token') ?? '')['idToken']
    
    const [instants, setInstants] = useState<any[]>([])

    function display() {
        fetch(`instants/${token}`).then(
            (value) => {return value.json()}
        ).then(
            (data) => {
                console.log('heres response')
                console.log(data)
                setInstants(data)
            }
        )
    }

    useEffect(()=>{
        display()
    }, []) 


    function logger(x: any) {
        console.log(x)
        return ''
    }

    return (
        <div className='home'> 
          <div className='instants'>
            {
                instants && instants.length>0 && instants.map(function(data, idx) {
                    return ([
                        <Instant 
                            username={data.username} 
                            location={data.location}
                            late={data.late} 
                            icon={data.avatar} 
                            primary={data.primary} 
                            secondary={data.secondary} 
                            caption={data.caption}
                            avatar={data.avatar}></Instant>,
                    ]);
                 })
            }
            {/* <Instant username={'salad'} location='boston' late={'null hr late'} icon={''} picture={''} caption={'lorem iptsum'}></Instant> */}

            </div>
        </div>
    )
}

export default Home;