import Instance from "@/models/instance";

import s from './instant.module.scss';

interface _Instant {
    instance: Instance;
}

export default function Instant({ instance }: _Instant) {
    console.log(instance);
    return (
        <div className={s.instant}>
            <h1>{instance.username}</h1>
            <p>{instance.caption}</p>
            <img src={instance.primary} />
            <img src={instance.secondary} />
        </div>



    )
}