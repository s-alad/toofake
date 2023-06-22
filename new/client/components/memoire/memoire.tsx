import Memory from "@/models/memory"
import s from "./memoire.module.scss"
import Draggable from "react-draggable"
import { useEffect, useState } from "react";
import axios from "axios";


export default function Memoire({ memory }: { memory: Memory }) {

    let [swap, setSwap] = useState<boolean>(false);

    let date = new Date(memory.date);
    let formatOptions: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let [location, setLocation] = useState<string>("");

    async function getLocation() {

        if (memory.location == undefined) {
            setLocation("No location data");
            return;
        }

        let mem = memory;

        let lat = mem.location!.latitude;
        let long = mem.location!.longitude;
        console.log(lat, long);

        try {
            console.log("axios started");
            let response = await axios.get(
                `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${long},${lat}&outSR=&forStorage=false&f=pjson`
            )
            console.log(response.data)
            setLocation(response.data.address.Match_addr + ", " + response.data.address.City)
        } catch (error) {
            console.log(error);
            setLocation("No location data");
        }
    }

    /* useEffect(() => {
        getLocation();
    }, []) */

    return (
        <div className={s.memory} key={memory.memid}>
            <div className={s.details}>
                <div className={s.date}>
                    {date.toLocaleDateString(undefined, formatOptions)}
                </div>
                <div className={s.location}>
                    {location}
                </div>
            </div>
            <div className={s.content}>
                <img src={swap ? memory.primary : memory.secondary} className={s.primary} />
                <div className={s.bounds} onClick={() => setSwap(!swap)}>
                    <Draggable axis="both" bounds="parent" >
                        <img src={swap ? memory.secondary : memory.primary} className={s.secondary} onClick={() => setSwap(!swap)} onMouseDown={(e) => { e.stopPropagation() }} />
                    </Draggable>
                </div>
            </div>
        </div>
    )
}