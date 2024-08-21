import {err, warn, is_debug, document} from "../global";
import { Config } from "../type";
export default async function(){
    const wtsf = await fetch("config.json");
    if(is_debug && !wtsf.ok)err("\"config.json\"にアクセスできません。\n")
    let cfg: Config = await wtsf.json().catch(e=>err("\"config.json\"の記述が不正です。"))
    if(is_debug){
        let eclist: string[] = [];
        const adderr = (m:string) => eclist.push(m); //エラーダイアログの項目の追加関数
        if(!cfg.pagestruct) adderr("pagestruct");
        if(!cfg.temp) warn("config.jsonで設定\"temp\"が欠損しています");
        if(!cfg.plugin) warn("config.jsonで設定\"plugin\"が欠如しています。");
        if(!cfg.notfound) warn("config.jsonで設定\"notfound\"が欠如しています。");
        if(!cfg.path) adderr("path"); else{
            if(!cfg.path.first) adderr("path.first");
            if(!cfg.path.last) adderr("path.last");
        }
        if(eclist.length != 0){
            let res = "\"config.js\"で以下の設定が欠如しています。\n";
            eclist.forEach(e=>{
                res += e + "\n";
            });
            err(res);
        }
    }
    if(cfg.icon){
        let si = document.createElement("link");
        let i = document.createElement("link");
        si.rel = "shortcut icon";
        i.rel = "icon";
        si.href = cfg.icon;
        i.href = cfg.icon;
        document.head.appendChild(si);
        document.head.appendChild(i);
    }
    return cfg;
}