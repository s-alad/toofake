import Instant from "../../components/instant";
import React, { useEffect } from 'react';
import './home.css';
import { useState } from 'react';
import { refresh } from "../../api/auth";

function Home() {    
    const [instants, setInstants] = useState<any[]>([])

    function display() {
        refresh();
        
        let token = JSON.parse(localStorage.getItem('token') ?? '')['idToken']
        fetch(`instants/${token}`).then(
            (value) => {return value.json()}
        ).then(
            (data) => {
                console.log('heres response')
                console.log(data)
                setInstants(data)
                console.log(Date.now())
            }
        )
    }

    useEffect(()=>{
        display()
    }, []) 

    return (
        <div className='home'> 
          <div className='instants'>
            {
                instants && instants.length>0 && instants.map(function(data, idx) {
                    return ([
                        <Instant 
                            key={data}
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