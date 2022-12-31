import Instant from "../../components/instant/instant";
import React, { useEffect } from 'react';
import './home.css';
import { useState } from 'react';
import { getme, refresh } from "../../api/auth";
import loader from "https://i.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp"

function Home() {
    const [instants, setInstants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingContent, setLoadingContent] = useState('')

    async function display() {
        await refresh();
        let token = localStorage.getItem('idtoken') ?? ''
        console.log(token)
        setLoadingContent('Loading... (this can take a sec but shouldn\'t take tooo long')
        fetch(`instants/${token}`).then(
            (value) => {
                return value.json()
            }
        ).then(
            (data) => {
                if ('error' in data) {
                    setLoadingContent('Error: ' + data['error'] + ' try refreshing the page :)')
                } else {
                    setInstants(data)
                    setLoading(false)
                }
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
                        {loadingContent}
                    </div> 
                    :
                    <div className='instants'>
                        {
                            instants && instants.length > 0 && instants.map(function (data, idx) {
                                console.log("comments: ", data.comments)
                                return ([
                                    <div key={idx}>
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
                                            comments={data.comments}
                                            postid={data.postid}></Instant>
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