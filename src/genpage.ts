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
    let now_txtelem: HTMLElement;
    let is_txt_enabled = false
    let is_txtmode = false;
    let is_native = false;
    let splText: string[];
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
        if(p[0]!=':' && p[0]!='=') is_txt_enabled = false ;
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
                splText = split_escape(p,":")
                if(splText.length < 3) break;
                splText = textplug(splText, plugin);
                let m2 = createElement(splText[1]);

                m2.innerHTML = splText[2];
                now_txtelem = m2;

                now_elem().appendChild(m2);
                break;
            case '=':
                splText = split_escape(p,"=")
                if(splText.length < 3) break;
                splText = textplug(splText, plugin);
                if(!is_txt_enabled){
                    now_elem().setAttribute(splText[1],splText[2]);
                }else{
                    now_txtelem.setAttribute(splText[1],splText[2]);
                }
                break;
            case '\\':
                splText =  split_escape(p,"\\")
                if(splText.length < 2) break;
                splText = textplug(splText, plugin);
                let ti = template.name.indexOf(splText[1]);
                if(ti<0)break;
                let tt = template.base[ti];

                splText.forEach((k,i)=>{
                    if(i < 2) return;
                    tt=tt.replaceAll("%"+(i-1),k);
                })
                convert(tt, now_elem(), template, plugin, false);
                break;
            case '&':
                now_elem().innerHTML += p.substring(1)
                break;
            case '-':
                splText = p.split("-");
                if(splText.length < 2) break;

                let g = createElement(splText[1]);
                now_elem().appendChild(g);

                layerElem.push(g);
                if(splText.length > 2) if(splText[2] === "DIRECT") is_native = true;
                break;
            case '+':
                is_native = false;
                layerElem.pop();
                break;
            case '@':
                splText = split_escape(p, '@')
                if(splText.length < 2) break;
                let plugdata = plugin.component.find(e=>e[1] == splText[1])
                if(!plugdata)break;
                splText.shift()
                splText.shift()
                plugdata[0](splText,(e:HTMLElement)=>now_elem().appendChild(e))
                break;
        }
    });
}
export default convert