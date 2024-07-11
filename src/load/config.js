import {err,path,warn} from "../global.js";
export default async ()=>{
    const wtsf = await fetch("config.json",{cache:"no-store"});
    if(!wtsf.ok)err("\"config.json\"にアクセスできません。\n")
    let cfg = await wtsf.json().catch(e=>err("\"config.json\"の記述が不正です。"))
    let eclist = [];
    const adderr = m => eclist.push(m); //エラーダイアログの項目の追加関数
    if(!cfg.pagestruct) adderr("pagestruct");
    if(!cfg.temp) adderr("temp"); 
    if(!cfg.icon) warn("config.jsonで設定\"icon\"が欠如しています。");
    if(!cfg.plugin) warn("config.jsonで設定\"plugin\"が欠如しています。");
    if(!cfg.pagepath) adderr("pagepath"); else{
        if(!cfg.pagepath.first) adderr("pagepath.first");
        if(!cfg.pagepath.last) adderr("pagepath.last");
    }
    if(eclist.length != 0){
        let res = "\"" + wtsetting + "\"で以下の設定が欠如しています。\n";
        eclist.forEach(e=>{
            res += e + "\n";
        });
        err(res);
    }
    path = cfg.pagepath
    return cfg;
}