import {setMainElement,notfound,path,document} from "../global"
import {Config} from "../type"
export default (config: Config) =>{
    let page_promise: Promise<string>[] = [];
    let page_elms: HTMLElement[] = [];
    let page_ids: string[] = [];
    config.pagestruct.forEach(e=>{
        let pass = e.default;
        if(e.id === "main"){
            let z = Object.fromEntries(new URLSearchParams(window.location.search));
            if(z.p != undefined){
                pass = path.first + z.p + path.last;
            }
        }
        let pe = document.createElement(e.ename);
        if(e.attr) e.attr.forEach(v=>pe.setAttribute(v.name,v.value));
        document.body.appendChild(pe);
        page_elms.push(pe);
        if(e.id === "main") setMainElement(pe);
        page_promise.push(fetch(pass).then(e=>{
            if(!e.ok) return notfound;
            return e.text();
        }).catch(e=>notfound));
        page_ids.push(e.id);
    });
    return {
        text: page_promise,
        elms: page_elms,
        ids: page_ids
    }
}