export interface Piatto {
    id: number,
    nome: string,
    prezzo: number,
    descrizione?: string,
    categoria?: string,
    immagine?: string,
    ingredienti?: string[],
    note?: string
}

export interface Categoria {
    id: number,
    nome: string,
    piatti: Piatto[];
}

interface FilterFunction {
    (piatto: Piatto): boolean
}

export interface Filtro{
    id: number,
    function: FilterFunction,
    name: string
}
