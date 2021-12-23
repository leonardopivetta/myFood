import { useEffect, useState } from "react"
import Popup from "reactjs-popup";
import { io } from "socket.io-client"
import { BACKENDADDRESS, HOSTNAME } from "../../constants";
import { Ordine } from "../../types";

export const OrderList = () => {

    const [orders, setOrders] = useState<Ordine[]>([]);
    const [selected, setSelcted] = useState<Ordine|undefined>(undefined);

    useEffect(() => {
        fetch(`${BACKENDADDRESS}ordini`)
        .then(res => res.json())
        .then(res => { 
            setOrders(res);
         });
        var socket = io(HOSTNAME+":3000", {transports: ['websocket']});
        socket.on("newOrder", (res)=>{
            fetch(`${BACKENDADDRESS}ordini`)
            .then(res => res.json())
            .then(res => { 
                setOrders(res);
            });
        })
    }, []);

    return <div>
        <Popup open={selected !== undefined }>
            <div className="h-screen w-screen bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm" >
                <div className="h-full w-full flex justify-center items-center"
                onClick={e=>{
                    if(e.target !== e.currentTarget) return;
                    setSelcted(undefined);
                }}>
                    <div className="container bg-white rounded-xl p-2 flex flex-col py-5" >
                        <div className="mx-auto text-center">
                            <p className="font-bold">{selected?.orario_consegna}</p>
                            {selected?.piatti.map(p => <p>{p.nome}</p>)}
                            <p>{selected?.note ?? ""}</p>
                            <p className="font-bold text-lg">Totale: {selected?.piatti.reduce((a, c)=> (a + c.prezzo), 0).toFixed(2)}€</p>
                        </div>
                        <div className="flex justify-evenly">
                            <div className="bg-green-400 px-5 py-2 rounded-3xl shadow-md font-bold text-white transform hover:scale-105 duration-150 select-none"
                                onClick={()=>{
                                    const options = {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            stato: "IN_PREPARAZIONE",
                                            id: selected?._id
                                        })
                                    };
                                    fetch(BACKENDADDRESS+"ordine/aggiorna_stato", options).then(res => (res.status === 200) ? setSelcted(undefined) : console.log("Errore"));
                                }}
                            >
                                CONFERMA
                            </div>
                            <div className="bg-red-400 px-5 py-2 rounded-3xl shadow-md font-bold text-white transform hover:scale-105 duration-150 select-none"
                            onClick={()=>{
                                let res = window.confirm("Sei sicuro di voler annullare l'ordine?");
                                if(!res) return;
                                const options ={
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        id: selected?._id,
                                        stato: "ANNULLATO"
                                    })
                                };
                                fetch(BACKENDADDRESS+"ordine/aggiorna_stato", options).then(res => (res.status === 200) ? setSelcted(undefined) : console.log("Errore"));
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
                        key={order._id}
                    >
                        <div className="mx-2">{order.orario_consegna}</div>
                        <div className="mx-2">{order.stato}</div>
                        <div className="mx-2">Numero piatti: {order.piatti.length}</div>
                    </div>)
            }
        </div>
    </div>
}