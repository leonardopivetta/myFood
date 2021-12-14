import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ShoppingCart = () => {

    const navigate = useNavigate();

    const [number, setNumber] = useState(JSON.parse(localStorage.getItem("cart") ?? "[]").length);
    
    useEffect(()=>{
        const handler = ()=> {
            setNumber(JSON.parse(localStorage.getItem("cart") ?? "[]").length);
        }
        window.addEventListener("storage",handler);
        return ()=>{
            window.removeEventListener("storage",handler);
        }
    },[]);
    

    return <div>
         <div className="fixed top-1 right-1 transform hover:scale-105 duration-200" onClick={() => navigate("/order")}>
                <div className="p-3 relative bg-white rounded-full hover:bg-secondary border border-secondary shadow-md hover:shadow-lg">
                    <div className="absolute top-0 right-0 px-1 rounded-full w-7 h-7 bg-primary text-center justify-center align-middle text-white flex">
                        <p className="my-auto mx-auto select-none"><b>{number}</b></p>
                    </div>
                    <FiShoppingCart size={40} className="pr-1"/>
                </div>
            </div>
    </div>;
}
