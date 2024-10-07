import { Template } from "./type"
export const is_debug:boolean = false
export const err = (msg: string)=>{
    if(is_debug){
        alert("liblog.jsエラー：" + msg);
        throw msg;
    }else{
        alert("liblog.jsでエラーが発生しました。\n管理者に問い合わせてください。")
        throw undefined;
    }
}
export const warn = (msg: string)=>{
    if(is_debug){
        console.warn("liblog.js警告："+msg)
    }
}
export let main_elm: HTMLElement
export const setMainElement = (e: HTMLElement)=>{
    main_elm = e
}
export let template: Template
export const setTemplate = (e: Template)=>{
    template = e
}
export const document = window.document
export const createElement = (e:string)=>document.createElement(e)
export const execDOM = (fn: ()=>void)=>{
    if(document.readyState == "loading"){
        document.addEventListener("DOMContentLoaded",()=>fn())
    }else{
        fn()
    }
}