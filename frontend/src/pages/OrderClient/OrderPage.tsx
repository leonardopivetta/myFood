import { useEffect, useRef, useState } from "react"
import { Menu, Orario, Piatto } from "../../types"
import { TiDeleteOutline } from "react-icons/ti"
import {BiWinkSmile} from "react-icons/bi"
import "./OrederPage.css";
import { CartaFedelta } from "./components/CartaFedelta";
import Popup from "reactjs-popup";
import { BACKENDADDRESS } from "../../constants";

export const OrderPage = () => {

    const [piatti, setPiatti] = useState<Piatto[]>(JSON.parse(window.localStorage.getItem("cart") || "[]"));
    const [cartaFedeltaSelcted, setCartaedeltaSelcted] = useState<boolean>(false);
    const [errore, setErrore] = useState<string>("");

    const orario = useRef<HTMLSelectElement>(null);
    const indirizzo = useRef<HTMLInputElement>(null);
    const note = useRef<HTMLTextAreaElement>(null);

    const [orariList, setOrariList] = useState<Array<{start:number, end: number}>>([]);

    const getSplitted = (inp: {start: number; end: number}[]) => {
        let out: string[] = [];
        inp.forEach(e =>{
            for(let i = e.start; i < e.end; i+=0.5){
                if(i%1 === 0){
                    out.push(i+":00 - "+i+":30");
                }else{
                    out.push(Math.floor(i)+":30 - "+(i+0.5)+":00");
                }
            }
        });
        return out;
    };


    useEffect(()=>{
        fetch(BACKENDADDRESS + "menu")
            .then(res => res.json())
            .then(res => {
                setOrariList(res.apertura.Lun);
            })
    }, []);

    const checkIfCorrect = () => {
        if (piatti.length === 0) return "Nessun piatto selezionato";
        if (orario.current?.value === "") return "Orario non inserito";
        // if (orario.current?.value.length !== 5) return "Orario non corretto";
        if (indirizzo.current?.value === "") return "Indirizzo non inserito";
        return "";
    }


    return (
        <div>
            <Popup open={errore !== ""} >
                <div className="h-screen w-screen bg-black bg-opacity-25 backdrop-blur-sm backdrop-filter flex flex-col justify-center"
                    onClick={() => setErrore("")}
                >
                    <div className="container w-2/3 p-5 rounded-3xl mx-auto text-lg text-center bg-white">
                        {errore}
                    </div>
                </div>
            </Popup>
            <div className="container self-center mx-auto px-2 lg:w-2/3">
                <h1 className="text-3xl py-3">Riepilogo Ordine</h1>
                <div id="piatti" className="rounded-3xl p-2 shadow-lg">
                    {
                        piatti.length > 0 ?
                            piatti.map(piatto =>
                                <div className="border rounded-xl px-1 my-1">
                                    <div className="flex">
                                        <p className="text-lg">{piatto.nome}</p>
                                        <div className="flex-grow"></div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-lg">{piatto.prezzo.toFixed(2)}€</p>
                                        </div>
                                        <TiDeleteOutline size={30} className="text-primary mx-1 transform hover:scale-105 duration-150" onClick={() => {
                                            const newPiatti = piatti.filter(p => p._id !== piatto._id);
                                            localStorage.setItem("cart", JSON.stringify(newPiatti));
                                            setPiatti(newPiatti);
                                        }} />
                                    </div>
                                    {piatto.note && <p className="pl-2">{piatto.note}</p>}
                                </div>)
                            : (
                                <div className="flex justify-center py-2">
                                    <p className="text-2xl">Nessun piatto presente, torna al menu e aggiungi qualche piatto al carrello</p><BiWinkSmile size={34} className="ml-2"/>
                                </div>
                            )
                    }
                    {
                        piatti.length > 0 ? (
                            <div>
                                <div className="h-0.5 border"></div>
                                <div className="flex">
                                    <p className="text-xl"><b>Totale</b></p>
                                    <div className="flex-grow"></div>
                                    <p className={"text-xl "+ (cartaFedeltaSelcted?"line-through":"font-bold") }>{piatti.reduce((a, b) => a + b.prezzo, 0).toFixed(2)}€</p>
                                    {cartaFedeltaSelcted && <p className="text-xl ml-2"><b>{(piatti.reduce((a, b) => a + b.prezzo, 0) * 0.9).toFixed(2)}€</b></p>}
                                    <div className="w-10"></div>
                                </div>
                            </div>

                        ) : null
                    }
                </div>
                {
                    piatti.length > 0 && (
                        <div>
                            <div className="h-3"></div>
                            <div id="scegli orario" className="flex my-3">
                                <h1 className="text-xl py-3 mr-4"><b>Scegli orario:</b></h1>
                                <select className="rounded-xl shadow-lg flex-grow p-2" ref={orario}>
                                    {
                                        getSplitted(orariList).map(orario => <option>{orario}</option>)
                                    }
                                </select>
                                {/* <input className="rounded-xl p-2 shadow-lg flex-grow flex justify-center transform hover:-translate-y-1 duration-300" ref={orario} required type={"time"} step={"any"}></ùinput> */}
                            </div>
                            <div id="indirizzo" className="flex my-3">
                                <h1 className="text-xl py-3 mr-4 sm:-mr-12 md:mr-2 "><b>Indirizzo di consegna:</b></h1>
                                <input type="text" className=" frounded-xl p-2 shadow-lg rounded-xl flex-grow  transform hover:-translate-y-1 duration-300" placeholder="Inserisci qui il tuo indirizzo..." ref={indirizzo}></input>
                            </div>
                            <div id="note" className="flex my-3">
                                <h1 className="text-xl py-3 mr-4 sm:-mr-12 md:mr-2"><b>Note sulla consegna:</b></h1>
                                <textarea className="flex-grow shadow-lg rounded-xl p-2 hover:-translate-y-1 duration-300 transform" placeholder="Non suonare al campanello, chiamare quando si arriva, etc..." ref={note}></textarea>
                            </div>
                            <div id="cartaFedeltà" className="flex justify-center my-3" >
                                <CartaFedelta selected={cartaFedeltaSelcted} setSelected={setCartaedeltaSelcted}/>
                            </div>
                            <div id="sceltaPagamento" className="w-100">
                                <h1 className="text-xl py-3 mr-4 text-center"><b>Scegli il metodo di pagamento:</b></h1>
                                <div className="flex justify-evenly">
                                    <div className="w-1/3 bg-primary hover:bg-secondary duration-300 px-2 rounded-xl group shadow-lg hover:-translate-y-1 transform hover:shadow-xl"
                                        onClick={() => {
                                            const res = checkIfCorrect();
                                            if (res === "") {    
                                                const requestBody = {
                                                    orario_consegna: orario.current!.value,
                                                    indirizzo: indirizzo.current!.value,
                                                    note: note.current!.value,
                                                    cartaFedelta: {"usata":cartaFedeltaSelcted},
                                                    piatti: piatti,
                                                    pagato:"contanti"
                                                };
                                                fetch(BACKENDADDRESS+"ordine/inserisci", {
                                                    method: "POST",
                                                    headers: {"Content-Type": "application/json"},
                                                    body: JSON.stringify(requestBody)
                                                }).then(res=>{
                                                    orario.current!.value = "";
                                                    indirizzo.current!.value = "";
                                                    note.current!.value = "";
                                                    localStorage.removeItem("cart");
                                                    window.location.href = "/success";
                                                    setPiatti([]);
                                                });
                                                
                                            } else {
                                                setErrore(res);
                                            }
                                        }}
                                    >
                                        <p className="text-center py-7 text-white text-lg"><b>PAGA IN CONTANTI</b></p>
                                    </div>
                                    <div className="w-1/3 bg-primary hover:bg-secondary duration-300 px-2 rounded-xl group shadow-lg hover:-translate-y-1 transform hover:shadow-xl"
                                        onClick={() => {
                                            setErrore("inoltro a pagina per il pagamento (per mandare l'ordine cliccare paga in contanti)");
                                        }}
                                    >
                                        <p className="text-center py-7 text-white text-lg"><b>PAGA ONLINE</b></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
} 