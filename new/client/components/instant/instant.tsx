import Instance from "@/models/instance";


interface _Instant {
    instances: Instance[];
}

export default function Instant({ instances }: _Instant) {
    return (
        <div>
            {
                instances.map((instance) => {
                    return (
                        <div>
                            <h1>{instance.username}</h1>
                            <p>{instance.caption}</p>
                        </div>
                    )
                })
            }

        </div>
    )
}