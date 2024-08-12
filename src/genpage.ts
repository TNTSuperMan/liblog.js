import {plugin,document,template} from "./global"
const textplug=(text:string[])=>{
    let ret = text
    plugin.text.forEach(e=>ret=e(ret))
    return ret
}
const split_escape=(text:string,p:string)=>{
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
const convert = (text:string,elm:HTMLElement,isMain:boolean)=>{ //ファイルを変換 ＊今回のメイン＊
    let layerElem = [elm];
    let now_txtelem: HTMLElement;
    let is_txt_enabled = false
    let is_txtmode = false;
    const now_elem = ()=>layerElem[layerElem.length-1]; 
    let is_native = false;
    let m: string[];
    let te: HTMLElement
    let st = text.split("\r").join('').split("\n");
    if(isMain){
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
                    te = document.createElement("p");
                    now_elem().appendChild(te);
                    layerElem.push(te);
                    is_txtmode = true;
                } else now_elem().innerHTML += "<br>";

                now_elem().innerHTML += p.substring(1)
                break;
            case ':':
                //m = p.split(":");
                m = split_escape(p,":")
                if(m.length < 3) break;
                m = textplug(m);
                let m2 = document.createElement(m[1]);

                m2.innerHTML = m[2];
                now_txtelem = m2;

                now_elem().appendChild(m2);
                break;
            case '=':
                m = split_escape(p,"=")
                if(m.length < 3) break;
                m = textplug(m);
                if(!is_txt_enabled){
                    now_elem().setAttribute(m[1],m[2]);
                }else{
                    now_txtelem.setAttribute(m[1],m[2]);
                }
                break;
            case '\\':
                m =  split_escape(p,"\\")
                if(m.length < 2) break;
                m = textplug(m);
                let ti = template.name.indexOf(m[1]);
                if(ti<0)break;
                let tt = template.base[ti];

                m.forEach((k,i)=>{
                    if(i < 2) return;
                    tt=tt.replaceAll("%"+(i-1),k);
                })
                convert(tt,now_elem(),false);
                break;
            case '&':
                m = p.split(""); 
                m[0]="";
                now_elem().innerHTML += m.join("");
                break;
            case '-':
                m = p.split("-");
                if(m.length < 2) break;

                let g = document.createElement(m[1]);
                now_elem().appendChild(g);

                layerElem.push(g);
                if(m.length > 2) if(m[2] === "DIRECT") is_native = true;
                break;
            case '+':
                is_native = false;
                layerElem.pop();
                break;
            case '@':
                m = p.split('@')
                if(m.length < 2) break;
                let plugdata = plugin.component.find(e=>e[1] == m[1])
                if(!plugdata)break;
                m.shift()
                m.shift()
                plugdata[0](m,(e:HTMLElement)=>now_elem().appendChild(e))
                break;
        }
    });
}
export default convert