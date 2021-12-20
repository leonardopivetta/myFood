export interface Piatto {
    _id: number,
    nome: string,
    prezzo: number,
    descrizione?: string,
    categoria?: string,
    immagine?: string,
    ingredienti?: string[],
    note?: string
}

export interface Categoria {
    _id: number,
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


export interface Orario {
    giorno: string,
    values: Array<{start:number, end: number}>
}

export interface Menu {
    apertura: Array<Orario>,
    categorie: Array<Categoria>
}