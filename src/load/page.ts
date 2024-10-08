import { Config } from "type";
import { setMainElement, document } from "../global"
export default (config: Config)=>{
    const page_promise: Promise<string>[] = [];
    const page_elms: HTMLElement[] = [];
    const page_ids: string[] = [];
    config.pagestruct.forEach(e=>{
        let pagepath = e.default;
        if(e.id == "main"){
            const p = new URLSearchParams(window.location.search).get("p")
            if(p){
                pagepath = config.path.first + p + config.path.last;
            }
        }
        const pe = document.createElement(e.ename);
        document.body.appendChild(pe);
        if(e.attr) e.attr.forEach(v=>pe.setAttribute(v.name,v.value));
        if(e.id == "main") setMainElement(pe);

        page_elms.push(pe);
        page_promise.push(fetch(pagepath).then(e=>{
            if(!e.ok) return config.notfound;
            return e.text();
        }).catch(()=>config.notfound));
        page_ids.push(e.id);
    });
    return {
        text: page_promise,
        elms: page_elms,
        ids: page_ids
    }
}