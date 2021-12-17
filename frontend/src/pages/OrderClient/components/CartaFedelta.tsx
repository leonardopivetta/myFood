import { FunctionComponent } from "react"

export const CartaFedelta: FunctionComponent<{selected: boolean, setSelected: Function}> = (props) => {
    return <div className={"h-32 w-1/2 bg-gradient-to-br rounded-3xl p-2 bg-repeat-round  " + (props.selected ? "from-primary to-secondary" : "from-gray-500 to-gray-700")}>
        <div className="bg-white bg-opacity-50 blur w-full h-full rounded-2xl flex-col flex justify-center">
            <p className="text-lg text-center select-none">Punti disponibili: 12/10</p>
            <div className="mx-auto p-1 rounded-2xl bg-primary px-4 my-2 hover:-translate-y-1 transform duration-300 hover:bg-secondary hover:shadow-md" onClick={()=>props.setSelected(!props.selected)}>
                <p className="text-lg text-white select-none"><b>{props.selected? "NON USARE" : "USA"}</b></p>
            </div>
        </div>
    </div>
}