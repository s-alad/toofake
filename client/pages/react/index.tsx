import Instance from "@/models/instance";
import useCheck from "@/utils/check";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import s from "./react.module.scss";
import l from "@/styles/loader.module.scss";

export default function Reacter() {
    let router = useRouter();
    if (!useCheck()) {
        return <></>
    }
    let [instances, setInstances] = useState<{ [key: string]: Instance }>({})
    let [loading, setLoading] = useState<boolean>(true);

    async function feed() {

        let authorization_token = localStorage.getItem("token");

        let headers = {
            "authorization": "Bearer " + authorization_token,
        }

        console.log("FETCING FEED")

        return axios.request({
            url: "https://toofake-cors-proxy-4fefd1186131.herokuapp.com/" + "https://mobile.bereal.com/api" + "/feeds/friends-v1",
            method: "GET",
            headers: headers,
        }).then(
            async (response) => {
                console.log("------------------")
                console.log("all request feed success");
                console.log(response.data);
                console.log("------------------")

                let newinstances: { [key: string]: Instance } = {};
                async function createInstance(data: any, usr: any) {
                    /* console.log("CURRENT INSTANCE DATA");
                    console.log(data);
                    console.log("=====================================") */
                    let id = data.id;
                    let newinstance = await Instance.moment(data, usr);
                    newinstances[id] = newinstance;
                    /* console.log("newinstances");
                    console.log(newinstances); */
                }
                
                let friends = response.data.friendsPosts;

                for (let i = 0; i < friends.length; i++) {
                    let thisuser = friends[i].user;
                    let posts = friends[i].posts;
                    for (let j = 0; j < posts.length; j++) {
                        let post = posts[j];
                        try {
                            await createInstance(post, thisuser);
                            setInstances({...newinstances});
                        } catch (error) {
                            console.log("COULDNT MAKE INSTANCE WITH DATA: ", post)
                            console.log(error);
                        }
                    }
                }

                console.log("newinstances");
                console.log(newinstances);
                console.log("=====================================")
                setLoading(false);
            }
        ).catch(
            (error) => {
                console.log(error);
                setLoading(false);
            }
        )
    }

    useEffect(() => {

        setLoading(true);

        feed()
    }, []);


    return (
        <div>
            {
                loading ? <div className={l.loader}></div> : 
                <div>
                    
                </div>
            }
        </div>
    );
}