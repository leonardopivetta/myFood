import React, { FunctionComponent, useEffect, useState } from "react";
import { FiShoppingCart } from 'react-icons/fi';
import { ShoppingCart } from '../../components/ShoppingCart';
import { Categoria, Filtro, Menu, Piatto } from "../../types";
import { BiArrowBack, BiHappyAlt } from "react-icons/bi";
import { BACKENDADDRESS, RESTAURANTNAME } from "../../constants";
import Lottie from "react-lottie-player";
import animationData from "../../animations/loading.json";
import { BsEmojiSunglassesFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";


export const MenuPage = () => {
    const [selectedPiatto, setSelectedPiatto] = useState<Piatto | undefined>(undefined);
    const [menu, setMenu] = useState<Menu | undefined>(undefined);
    const [isSmall, setisSmall] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener("resize",() => {
            setisSmall(window.innerWidth < 600);
        })
        setisSmall(window.innerWidth < 600);
        fetch(BACKENDADDRESS + 'menu')
            .then(res => res.json())
            .then(res => {
                setMenu(res as Menu);
            }).catch(console.error)
    }, []);

    if (menu === undefined) {
        return <div className="h-screen w-screen flex justify-center align-middle flex-col">
            <div className="mx-auto flex space-x-2">
                <p className="text-center text-lg">Stiamo caricando i piatti</p><BsEmojiSunglassesFill size={32} className="animate-bounce duration-70" />
            </div>
            <Lottie animationData={animationData} loop style={{ height: "70%", width: "70%" }} play className="mx-auto" />
        </div>
    }

    return (
        <div className="flex h-full w-full">
            {((isSmall && selectedPiatto !== undefined)) &&
                <div>
                    <div className="fixed top-1 left-1 " onClick={() => setSelectedPiatto(undefined)}>
                        <div className="p-3 relative">
                            <IoIosArrowBack size={40} className="" color="white" />
                        </div>
                    </div>
                </div>}
            <ShoppingCart />
            {((isSmall && selectedPiatto === undefined) || !isSmall) &&
                <LeftPart setSelected={setSelectedPiatto} selected={selectedPiatto} menu={menu!} />}
            {((isSmall && selectedPiatto !== undefined) || !isSmall) &&
                <RightPart piatto={selectedPiatto} />}
        </div>
    )
};


const LeftPart: FunctionComponent<{ setSelected: Function, selected?: Piatto, menu: Menu }> = (props) => {

    const [filtri, setFiltri] = useState<Filtro[]>([]);

    const isSmall = window.innerWidth < 600;

    return (
        <div className={"overflow-y-auto h-screen border border-gray-300 border-r-2 " + (isSmall ? "w-screen" : "w-1/3")}>
            <Filtri filters={filtri} setFilter={setFiltri} />
            {
                props.menu.categorie.map(categoria => {
                    const piattiFiltered = categoria.piatti.filter((e) => {
                        let result = true;
                        filtri.forEach((f) => {
                            result = result && f.function(e);
                        })
                        return result;
                    })
                    if (piattiFiltered.length === 0) return <div />;
                    return (
                        <div key={categoria._id} className="p-3 border-b border-gray-300">
                            <h3 className="text-xl font-bold">{categoria.nome}</h3>
                            <div>
                                {
                                    piattiFiltered.map(piatto => {
                                        return <div
                                            key={piatto._id}
                                            className={"transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-between text-lg shadow-lg p-2 m-2 cursor-pointer select-none hover:bg-primary hover:text-white duration-200 rounded-3xl" + ((props.selected?._id === piatto._id) ? " bg-secondary text-white" : "")}
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

    const [isSmall, setisSmall] = useState<boolean>(false);

    useEffect(()=>{
        window.addEventListener("resize",() => {
            setisSmall(window.innerWidth < 600);
        })
        setisSmall(window.innerWidth < 600);
    }, []);

    if (props.piatto === undefined) {
        return <div className="w-2/3 h-screen flex justify-center items-center ">
            <BiArrowBack className="" size={50} />
            <p className="text-xl my-auto">Seleziona un piatto dal menu a sinistra</p>
            <BiHappyAlt className="animate-bounce mx-2" size={50} />
        </div>
    }

    return (
        <div className={"h-screen flex flex-col " + (isSmall ? "w-screen" : "w-2/3")}>
            <div className="h-1/4 w-full">
                <img alt={props.piatto._id + "_image"} src={props.piatto.immagine ?? "https://picsum.photos/1920/400?random=" + props.piatto._id} className="w-full h-full object-cover "></img>
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
                                key={ingrediente + Math.random() * 100}
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
                        <textarea placeholder="Inserisci qui le tue note..." id={"note_piatto_" + props.piatto._id} className="h-full w-full"></textarea>
                    </form>
                </div>
            </div>
            <div className="relative left-0 right-0 bottom-0 transform mx-2 py-2 mt-4 w-auto flex justify-center align-middle border border-primary hover:bg-primary rounded-3xl group my-2 hover:-translate-y-1 duration-200 select-none" onClick={() => {
                // localStorage.setItem("my.food.cart", JSON.parse(localStorage.getItem("my.food.cart") ?? "[]").concat([props.piatto]));
                const piatti = JSON.parse(window.localStorage.getItem("cart") || "[]");
                const currentPiatto = { ...props.piatto! };
                const note = (document.getElementById("note_piatto_" + props.piatto!._id) as HTMLTextAreaElement).value;
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

const Filtri: FunctionComponent<{ filters: Filtro[], setFilter: Function }> = props => {


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
        },
        {
            id: 3,
            name: "Per vegetariani",
            function: (e: Piatto) => {
                return (e.ingredienti?.includes("vegetariano") || e.ingredienti?.includes("vegan")) ?? false;
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
                        className={"mx-2 px-3 shadow-lg rounded-2xl py-2 mt-2 text-lg select-none cursor-pointer " + (props.filters.find(f => f.id === filter.id) !== undefined ? "bg-secondary text-white" : "")}
                        onClick={() => {
                            if (props.filters.find(f => f.id === filter.id) !== undefined) {
                                props.setFilter(props.filters.filter(f => f.id !== filter.id));
                            } else {
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