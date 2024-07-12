import {plugin,document} from "./global.js"
function textplug(text){
    let ret = text
    plugin.text.forEach(e=>ret=e(ret))
    return ret
}
const convert = (text,elm,isMain,template)=>{ //ファイルを変換 ＊今回のメイン＊
    let layerElem = [elm];
    let now_txtelem = null;
    let is_txtmode = false;
    const now_elem = ()=>layerElem[layerElem.length-1]; 
    let is_native = false;
    let m;
    let st = text.split("\r").join('').split("\n");
    if(isMain){
        elm.innerHTML = "";
        document.querySelector("title").innerText = st[0];
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
        if(p[0]!=':' && p[0]!='=') now_txtelem = null;
        switch(p[0]){
            case '/':
                if(p[1]==='/') break;
                if(!is_txtmode){
                    m = document.createElement("p");
                    now_elem().appendChild(m);
                    layerElem.push(m);
                    is_txtmode = true;
                } else now_elem().innerHTML += "<br>";

                m = p.split(""); m[0]=null;
                now_elem().innerHTML += m.join("");
                break;
            case ':':
                m = p.split(":");
                if(m.length < 3) break;
                m = textplug(m);
                let m2 = document.createElement(m[1]);

                m2.innerHTML = m[2];
                now_txtelem = m2;

                now_elem().appendChild(m2);
                break;
            case '=':
                m = p.split('=');
                if(m.length < 3) break;
                m = textplug(m);
                if(!now_txtelem){
                    now_elem().setAttribute(m[1],m[2]);
                }else{
                    now_txtelem.setAttribute(m[1],m[2]);
                }
                break;
            case '\\':
                m = p.split("\\");
                if(m.length < 2) break;
                m = textplug(m);
                let ti = template.name.indexOf(m[1]);
                if(ti<0)break;
                let tt = template.base[ti];

                m.forEach((k,i)=>{
                    if(i < 2) return;
                    tt=tt.replaceAll("%"+(i-1),k);
                })
                convert(tt,now_elem(),false,template);
                break;
            case '&':
                m = p.split(""); m[0]=null;
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
                now_elem().appendChild(plugdata[0](m))
                break;
        }
    });
}
export default convert