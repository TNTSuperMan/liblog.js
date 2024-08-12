export type Path = {
    first: string,
    last: string
}
export type Template = {
    base: string[],
    name: string[]
}
export type Config = {
    temp?: {
        name: string,
        base: string
    }[],
    plugin?: string[],
    icon?: string,
    notfound: string,
    pagepath: Path,
    pagestruct: {
        id: string,
        ename: string,
        default: string,
        attr?: {
            name: string,
            value: string
        }[]
    }[]
}