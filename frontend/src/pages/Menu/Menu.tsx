import React, { FunctionComponent, useEffect, useState } from "react";
import { FiShoppingCart } from 'react-icons/fi';
import { ShoppingCart } from '../../components/ShoppingCart';
import { Categoria, Filtro, Piatto } from "../../types";
import {BiArrowBack, BiHappyAlt} from "react-icons/bi";

const semplePiatti: Piatto[] = [
    {
        id: 1,
        nome: 'Pizza',
        prezzo: 10.0,
        ingredienti: ["Pasta", "Pomodoro", "Mozzarella", "Pollo", "Pasta", "Pomodoro", "Mozzarella", "Pollo", "Pasta", "Pomodoro", "Mozzarella", "Pollo", "Pasta", "Pomodoro", "Mozzarella", "Pollo",]
    },
    {
        id: 2,
        nome: 'Pasta',
        prezzo: 15.0,
    },
    {
        id: 3,
        nome: 'Spaghetti',
        prezzo: 20.0,
    },
    {
        id: 4,
        nome: 'Bibita',
        prezzo: 5.0,
        ingredienti: ["vegan"]
    },
    {
        id: 5,
        nome: 'Pizza',
        prezzo: 10.0,
        ingredienti: ["Pasta", "Pomodoro", "Mozzarella", "Pollo", "Pasta", "Pomodoro", "Mozzarella", "Pollo", "Pasta", "Pomodoro", "Mozzarella", "Pollo", "Pasta", "Pomodoro", "Mozzarella", "Pollo",]
    },
    {
        id: 6,
        nome: 'Pasta',
        prezzo: 15.0,
    },
    {
        id: 7,
        nome: 'Spaghetti',
        prezzo: 20.0,
    },
    {
        id: 8,
        nome: 'Bibita',
        prezzo: 5.0,
        ingredienti: ["gluten-free"]
    }
];

const sampleCategorie: Categoria[] = Array.from({ length: 4 }).map((_, i) => {
    return {
        id: i + 1,
        nome: `Categoria ${i + 1}`,
        piatti: semplePiatti.slice(i * 2, i * 2 + 2)
    }
})

export const Menu = () => {
    const [selectedPiatto, setSelectedPiatto] = useState<Piatto | undefined>(undefined);

    return (
        <div className="flex h-full w-full">
            <ShoppingCart />
            <LeftPart setSelected={setSelectedPiatto} selected={selectedPiatto} />
            <RightPart piatto={selectedPiatto} />
        </div>
    )
};


const LeftPart: FunctionComponent<{ setSelected: Function, selected?: Piatto }> = (props) => {

    const [filtri, setFiltri] = useState<Filtro[]>([]);

    return (
        <div className="w-1/3 overflow-y-auto h-screen border border-gray-300 border-r-2">
            <Filtri filters={filtri} setFilter={setFiltri}/>
            {
                sampleCategorie.map(categoria => {
                    const piattiFiltered = categoria.piatti.filter((e)=>{
                        let result = true;
                        filtri.forEach((f)=>{
                            result = result && f.function(e);
                        })
                        return result;
                    })
                    if(piattiFiltered.length === 0) return <div/>;
                    return (
                        <div key={categoria.id} className="p-3 border-b border-gray-300">
                            <h3 className="text-xl font-bold">{categoria.nome}</h3>
                            <div>
                                {
                                    piattiFiltered.map(piatto => {
                                        return <div
                                            key={piatto.id}
                                            className={"transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-between text-lg shadow-lg p-2 m-2 cursor-pointer select-none hover:bg-primary hover:text-white duration-200 rounded-3xl" + ((props.selected?.id === piatto.id) ? " bg-secondary text-white" : "")}
                                            onClick={() => props.setSelected(piatto)}>
                                            <p className="text-center w-full"><b>{piatto.nome}</b></p>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

const RightPart: FunctionComponent<{ piatto: Piatto | undefined }> = (props) => {
    if (props.piatto === undefined) {
        return <div className="w-2/3 h-screen flex justify-center items-center ">
            <BiArrowBack className="" size={50} />
            <p className="text-xl my-auto">Seleziona un piatto dal menu a sinistra</p>
            <BiHappyAlt className="animate-bounce mx-2" size={50}/>
        </div>
    }
    return (
        <div className="w-2/3 h-screen flex flex-col">
            <div className="h-1/4 w-full">
                <img alt={props.piatto.id + "_image"} src={props.piatto.immagine ?? "https://picsum.photos/1920/400?random=" + props.piatto.id} className="w-full h-full object-cover "></img>
            </div>
            <div className="flex flex-col px-2 flex-grow">
                <div>
                    <h1 className="text-3xl">
                        <b>{props.piatto.nome}</b>
                    </h1>
                </div>
                <div>
                    <p className="text-xl">{props.piatto.prezzo.toFixed(2) + "€"}</p>
                </div>
                <div className="flex flex-wrap w-full">
                    {
                        props.piatto.ingredienti?.map(ingrediente => {
                            return <div
                            key={ingrediente+Math.random()*100} 
                            className="px-2 border rounded-2xl py-1 mr-2 mt-2 text-lg transform hover:-translate-y-2 duration-100">
                                {ingrediente}
                            </div>
                        })
                    }
                </div>
                <div className="px-2 mt-2">
                    <p className="text-lg"><b>Note:</b></p>
                </div>
                <div className="flex-grow w-full py-2 px-2 my-2 border rounded-2xl">
                    <form className="h-full">
                        <textarea placeholder="Inserisci qui le tue note..." id={"note_piatto_"+props.piatto.id} className="h-full w-full"></textarea>
                    </form>
                </div>
            </div>
            <div className="relative left-0 right-0 bottom-0 transform mx-2 py-2 mt-4 w-auto flex justify-center align-middle border border-primary hover:bg-primary rounded-3xl group my-2 hover:-translate-y-1 duration-200 select-none" onClick={() => {
                // localStorage.setItem("my.food.cart", JSON.parse(localStorage.getItem("my.food.cart") ?? "[]").concat([props.piatto]));
                const piatti = JSON.parse(window.localStorage.getItem("cart") || "[]");
                const currentPiatto = {...props.piatto!};
                const note = (document.getElementById("note_piatto_"+props.piatto!.id)as HTMLTextAreaElement).value;
                currentPiatto.note = note;
                window.localStorage.setItem("cart", JSON.stringify(piatti.concat([currentPiatto])));
                window.dispatchEvent(new Event("storage"));
            }}>
                <p className="my-auto px-2 group-hover:text-white text-xl"><b>AGGIUNGI AL CARRELLO</b></p>
                <div className="group-hover:text-white">
                    <FiShoppingCart size={40} />
                </div>
            </div>
        </div>
    );
}

const Filtri : FunctionComponent<{filters: Filtro[], setFilter: Function}>= props =>{

    
    const filtri: Filtro[] = [
        {
            id: 1,
            name: "Per celiaci",
            function: (e: Piatto) => {
                return e.ingredienti?.includes("gluten-free") ?? false;
            },
        },
        {
            id: 2,
            name: "Per vegani",
            function: (e: Piatto) => {
                return e.ingredienti?.includes("vegan") ?? false;
            },
        }
    ];


    return <div className="border-b-1 border pb-2">
        <p className="text-xl pl-2"><b>Filtri:</b></p>
        <div className="flex flex-wrap justify-start">
            {
                filtri.map(filter => {
                    return <div 
                        key={filter.id}
                        className={"mx-2 px-3 shadow-lg rounded-2xl py-2 mt-2 text-lg select-none cursor-pointer "+(props.filters.find(f => f.id === filter.id) !== undefined ? "bg-secondary text-white" :"")}
                        onClick={()=>{
                            if(props.filters.find(f => f.id === filter.id) !== undefined){
                                props.setFilter(props.filters.filter(f => f.id !== filter.id));
                            }else{
                                props.setFilter(props.filters.concat(filter));
                            }
                        }}
                    >
                        {filter.name}
                    </div>
                })
            }
        </div>
    </div>
}