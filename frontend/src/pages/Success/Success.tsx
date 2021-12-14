import Lottie from "react-lottie-player";
import { useNavigate } from "react-router-dom";
import * as doneAnimation from "../../animations/done.json";

export const Success = () => {

    const navigate = useNavigate();

    return (
        <div className="h-screen w-screen flex flex-col justify-center">
            <h1 className="text-3xl text-center">Abbiamo preso il tuo ordine in carico!</h1>
            <div className="h-1/2 w-1/2 mx-auto">
            <Lottie 
                play
                animationData={doneAnimation}
                style={{height: "100%", width: "100%"}}
                loop={false}
            />
            <div className="rounded-3xl shadow-xl py-5 transform hover:-translate-y-1 duration-300  bg-secondary hover:shadow-2xl"
                onClick={()=>{
                    navigate("/menu");
                }}
            >
                <p className="text-3xl text-center p-2  text-white"><b>Torna al menu</b></p>
            </div>
            </div>
        </div>
    );
};