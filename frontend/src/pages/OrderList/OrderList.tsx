import { useEffect, useState } from "react"
import Popup from "reactjs-popup";
import { io } from "socket.io-client"
import { BACKENDADDRESS } from "../../constants";
import { Ordine } from "../../types";

export const OrderList = () => {

    const [orders, setOrders] = useState<Ordine[]>([]);
    const [selected, setSelcted] = useState<Ordine|undefined>(undefined);

    useEffect(() => {
        fetch(`${BACKENDADDRESS}ordini`)
        .then(res => res.json())
        .then(res => { 
            console.log(res);
            setOrders(res);
         });
        // var socket = io(BACKENDADDRESS, {transports: ['websocket']});
        // socket.on("updated", (res)=>{
        //     console.log(res);
        // })
    }, []);

    return <div>
        <Popup open={selected !== undefined }>
            <div className="h-screen w-screen bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"
                onClick={()=> setSelcted(undefined)}>
                <div className="h-full w-full flex justify-center items-center">
                    <div className="container bg-white rounded-xl p-2 flex flex-col">
                        <p className="font-bold">{selected?.orario_consegna}</p>
                        {selected?.piatti.map(p => <p>{p.nome}</p>)}
                        <p>{selected?.note ?? ""}</p>
                        <p className="font-bold text-lg">{selected?.piatti.reduce((a, c)=> (a + c.prezzo), 0).toFixed(2)}€</p>
                        <div className="flex justify-evenly">
                            <div className="bg-green-400 px-5 py-2 rounded-3xl shadow-md font-bold text-white transform hover:scale-105 duration-150 select-none">
                                CONFERMA
                            </div>
                            <div className="bg-red-400 px-5 py-2 rounded-3xl shadow-md font-bold text-white transform hover:scale-105 duration-150 select-none"
                            onClick={()=>{
                                const options ={
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        id: selected?._id,
                                        stato: "ANNULLATO"
                                    })
                                };
                                fetch(BACKENDADDRESS+"ordine/aggiorna_stato", options).then(console.log);
                            }}>
                                RIFIUTA
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
        <div className="container flex-col justify-center w-screen mx-auto">
            {orders
                .sort((a,b)=>b.orario_consegna.localeCompare(a.orario_consegna))
                .map(order => 
                    <div className="flex justify-center rounded-2xl shadow-lg my-5 py-2 hover:text-white hover:bg-secondary duration-200 transform hover:-translate-y-1"
                        onClick={()=>setSelcted(order)}
                    >
                        <div className="mx-2">{order.orario_consegna}</div>
                        <div className="mx-2">{order.stato}</div>
                        <div className="mx-2">Numero piatti: {order.piatti.length}</div>
                    </div>)
            }
        </div>
    </div>
}