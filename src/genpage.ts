import { PluginData, Template } from "type"
import { document, createElement } from "./global"
function textplug(text:string[], plugin: PluginData){
    let ret = text
    plugin.text.forEach(e=>ret=e(ret))
    return ret
}
function split_escape(text:string,p:string){
    const rettxt = ["",""]
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
function convert(text: string, elm: HTMLElement, template: Template[], plugin: PluginData, is_main: boolean){ //ファイルを変換 ＊今回のメイン＊
    const layerElem = [elm];
    let last_elm: HTMLElement | null;
    let is_txtmode = false;
    let is_native = false;
    let splitted: string[];
    let te: HTMLElement
    const now_elem = ()=>layerElem[layerElem.length-1]; 
    const st = text.split("\r").join('').split("\n");
    if(is_main){
        elm.innerHTML = "";
        const title = document.querySelector("title")
        if(title)
            title.textContent = st[0]
    }
    let temp_elm:HTMLElement | undefined
    let temp_data:Template | undefined
    let temp_base:string|undefined
    let temp_plg : [(str:string[],e:((e:HTMLElement)=>HTMLElement))=>HTMLElement, string] | undefined = undefined
    st.forEach((p)=>{
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
                splitted = split_escape(p,":")
                if(splitted.length < 3) break;
                splitted = textplug(splitted, plugin);
                temp_elm = createElement(splitted[1]);

                temp_elm.innerHTML = splitted[2];
                last_elm = temp_elm;
                

                now_elem().appendChild(temp_elm);
                break;
            case '=':
                splitted = split_escape(p,"=")
                if(splitted.length < 3) break;
                splitted = textplug(splitted, plugin);
                if(last_elm){
                    last_elm.setAttribute(splitted[1],splitted[2]);
                }else{
                    now_elem().setAttribute(splitted[1],splitted[2]);
                }
                break;
            case '\\':
                splitted =  split_escape(p,"\\")
                if(splitted.length < 2) break;
                splitted = textplug(splitted, plugin);
                temp_data = template.find(e=>e.name==splitted[1]);
                if(!temp_data)break;
                temp_base = temp_data.base;
                
                splitted.forEach((k,i)=>{
                    if(i < 2) return;
                    if(temp_base){
                        temp_base=temp_base.replaceAll("%"+(i-1),k);
                    }
                })
                convert(temp_base, now_elem(), template, plugin, false);
                break;
            case '&':
                now_elem().innerHTML += p.substring(1)
                break;
            case '-':
                splitted = p.split("-");
                if(splitted.length < 2) break;

                temp_elm = createElement(splitted[1]);
                now_elem().appendChild(temp_elm);

                layerElem.push(temp_elm);
                if(splitted.length > 2) if(splitted[2] === "DIRECT") is_native = true;
                break;
            case '+':
                is_native = false;
                layerElem.pop();
                break;
            case '@':
                splitted = split_escape(p, '@')
                if(splitted.length < 2) break;
                temp_plg = plugin.component.find(e=>e[1] == splitted[1])
                if(!temp_plg)break;
                temp_plg[0](splitted.toSpliced(0, 2),(e:HTMLElement)=>now_elem().appendChild(e))
                break;
        }
    });
}
export default convert