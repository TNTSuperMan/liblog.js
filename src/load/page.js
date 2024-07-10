import {main_elm,errpage} from "../global.js"
export default config =>{
    let page_promise = [];
    let page_elms = [];
    let page_ids = [];
    config.pagestruct.forEach(e=>{
        let pass = e.default;
        if(e.id === "main"){
            let z = Object.fromEntries(new URLSearchParams(window.location.search));
            if(z.p != undefined){
                pass = f.first + z.p + f.last;
            }
        }
        let pe = document.createElement(e.ename);
        if(e.attr)e.attr.forEach(v=>pe.setAttribute(v.name,v.value));
        document.body.appendChild(pe);
        page_elms.push(pe);
        if(e.id === "main") main_elm = pe;
        page_promise.push(fetch(pass).then(e=>{
            if(!e.ok) return errpage;
            return e.text();
        }).catch(e=>errpage));
        page_ids.push(e.id);
    });
    return {
        text: page_promise,
        elms: page_elms,
        ids: page_ids
    }
}