import Memory from "@/models/memory"
import s from "./memoire.module.scss"
import Draggable from "react-draggable"
import { useState } from "react";


export default function Memoire({ memory }: { memory: Memory }) {

    let [swap, setSwap] = useState<boolean>(false);

    return (
        <div className={s.memory} key={memory.memid}>
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