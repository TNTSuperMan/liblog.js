import {Template,Path} from "./type"
export const is_debug:boolean = true
export const err = (msg: string) => {
    if(is_debug){
        alert("liblog.jsエラー：" + msg);
        throw msg;
    }else{
        alert("liblog.jsでエラーが発生しました。\n管理者に問い合わせてください。")
        throw undefined;
    }
}
export const warn = (msg: string) => {
    if(is_debug){
        console.warn("liblog.js警告："+msg)
    }
}
export let plugin: {
    text: Function[],
    component: [Function, string][]
} = {
    text:[],
    component:[]
}
export let main_elm: HTMLElement
export let path: Path
export function setMainElement(e: HTMLElement){
    main_elm = e
}
export function setPath(e: Path){
    path = e
}
export let notfound: string
export function setNotFound(e: string){
    notfound = e
}
export let template: Template
export function setTemplate(e: Template){
    template = e
}
export const document = window.document
