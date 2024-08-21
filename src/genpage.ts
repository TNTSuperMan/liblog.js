import { Plugin, Template } from "type"
import { document, createElement } from "./global"
function textplug(text:string[], plugin: Plugin){
    let ret = text
    plugin.text.forEach(e=>ret=e(ret))
    return ret
}
function split_escape(text:string,p:string){
    let rettxt = ["",""]
    let idx = 1
    for(let i = 1;i < text.length;i++){
        if((p != "\\" && text[i] == "\\" || text[i] == "/") && 
            i != (text.length - 1) && text[i + 1] == p){
            rettxt[idx] += p
            i++
        }else if(text[i] == p){
            rettxt.push("")
            idx++
        }else{
            rettxt[idx] += text[i]
        }
    }
    return rettxt
}
function convert(text: string, elm: HTMLElement, template: Template, plugin: Plugin, is_main: boolean){ //ファイルを変換 ＊今回のメイン＊
    let layerElem = [elm];
    let last_elm: HTMLElement | null;
    let is_txtmode = false;
    let is_native = false;
    let split_text: string[];
    let te: HTMLElement
    const now_elem = ()=>layerElem[layerElem.length-1]; 
    const st = text.split("\r").join('').split("\n");
    if(is_main){
        elm.innerHTML = "";
        let title = document.querySelector("title")
        if(title){
            title.textContent = st[0]
        }
    }
    st.forEach((p,i)=>{
        if(p[0] == '+') is_native = false;
        if(is_native) {
            now_elem().innerHTML += p + "\n";
            return;
        }
        if(p[0]!='/' || p[1]=='/'){
            if(is_txtmode) layerElem.pop();
            is_txtmode = false;
        }
        if(p[0]!=':' && p[0]!='=') last_elm = null ;
        switch(p[0]){
            case '/':
                if(p[1]==='/') break;
                if(!is_txtmode){
                    te = createElement("p");
                    now_elem().appendChild(te);
                    layerElem.push(te);
                    is_txtmode = true;
                } else now_elem().innerHTML += "<br>";

                now_elem().innerHTML += p.substring(1)
                break;
            case ':':
                split_text = split_escape(p,":")
                if(split_text.length < 3) break;
                split_text = textplug(split_text, plugin);
                let m2 = createElement(split_text[1]);

                m2.innerHTML = split_text[2];
                last_elm = m2;
                

                now_elem().appendChild(m2);
                break;
            case '=':
                split_text = split_escape(p,"=")
                if(split_text.length < 3) break;
                split_text = textplug(split_text, plugin);
                if(last_elm){
                    last_elm.setAttribute(split_text[1],split_text[2]);
                }else{
                    now_elem().setAttribute(split_text[1],split_text[2]);
                }
                break;
            case '\\':
                split_text =  split_escape(p,"\\")
                if(split_text.length < 2) break;
                split_text = textplug(split_text, plugin);
                let ti = template.name.indexOf(split_text[1]);
                if(ti<0)break;
                let tt = template.base[ti];

                split_text.forEach((k,i)=>{
                    if(i < 2) return;
                    tt=tt.replaceAll("%"+(i-1),k);
                })
                convert(tt, now_elem(), template, plugin, false);
                break;
            case '&':
                now_elem().innerHTML += p.substring(1)
                break;
            case '-':
                split_text = p.split("-");
                if(split_text.length < 2) break;

                let g = createElement(split_text[1]);
                now_elem().appendChild(g);

                layerElem.push(g);
                if(split_text.length > 2) if(split_text[2] === "DIRECT") is_native = true;
                break;
            case '+':
                is_native = false;
                layerElem.pop();
                break;
            case '@':
                split_text = split_escape(p, '@')
                if(split_text.length < 2) break;
                let plugdata = plugin.component.find(e=>e[1] == split_text[1])
                if(!plugdata)break;
                split_text.shift()
                split_text.shift()
                plugdata[0](split_text,(e:HTMLElement)=>now_elem().appendChild(e))
                break;
        }
    });
}
export default convert