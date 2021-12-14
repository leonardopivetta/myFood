import { useEffect, useState } from "react"
import {io} from "socket.io-client"

export const OrderList = () => {

    const [res, setRes] = useState({});

    useEffect(() => {
        var socket = io("http://localhost:4001", {transports: ['websocket']});
        socket.on("updated", (res)=>{
            console.log(res);
            setRes(res);
        })
    }, []);

    return <div>
        {JSON.stringify(res)}
    </div>
}