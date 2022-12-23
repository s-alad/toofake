import Instant from "../../components/instant/instant";
import React, { useEffect } from 'react';
import './home.css';
import { useState } from 'react';
import { getme, refresh } from "../../api/auth";
import loader from "https://i.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp"

function Home() {
    const [instants, setInstants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    async function display() {
        await refresh();
        let token = localStorage.getItem('idtoken') ?? ''
        console.log(token)
        fetch(`instants/${token}`).then(
            (value) => {
                console.log(value)
                return value.json()
            }
        ).then(
            (data) => {
                setInstants(data)
                setLoading(false)
            }
        )
    }

    useEffect(() => {
        display()
    }, [])

    return (
        <div className='home'>
            {
                loading ? 
                    <div className='loading'>
                        {/* <img src={"https://i.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp"} /> */}
                        Loading... (this can take a sec but shouldn't take tooo long)
                    </div> 
                    :
                    <div className='instants'>
                        {
                            instants && instants.length > 0 && instants.map(function (data, idx) {
                                console.log("comments: ", data.comments)
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
            }

        </div>
    )
}

export default Home;