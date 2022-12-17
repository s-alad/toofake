import Instant from "../../components/instant/instant";
import React, { useEffect } from 'react';
import './home.css';
import { useState } from 'react';
import { refresh } from "../../api/auth";

function Home() {    
    const [instants, setInstants] = useState<any[]>([])

    async function display() {
        await refresh();
        let token = localStorage.getItem('idtoken') ?? ''
        console.log('refreshhhhh')
        console.log(token)
        fetch(`instants/${token}`).then(
            (value) => {
                console.log(value)
                return value.json()
            }
        ).then(
            (data) => {
                setInstants(data)
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
                    console.log(data.comments)
                    return ([
                        <div>
                            <Instant 
                            key={data}
                            username={data.username} 
                            location={data.location}
                            late={data.late} 
                            icon={data.avatar} 
                            primary={data.primary} 
                            secondary={data.secondary} 
                            caption={data.caption}
                            avatar={data.avatar}
                            reactions={data.reactions}
                            comments={data.comments}></Instant>
                            <div className="takespace"></div>
                        </div>,
                    ]);
                 })
            }
            </div>
        </div>
    )
}

export default Home;