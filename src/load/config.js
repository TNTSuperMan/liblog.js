import {err,path,warn} from "../global.js";
export default async ()=>{
    const wtsetting = "config.json";
    const wtsf = await fetch(wtsetting,{cache:"no-store"});
    if(!wtsf.ok){
        err("\"config.json\"にアクセスできません\n")
    }
    let wts = {}; //設定情報
    try{
        wts = JSON.parse(await wtsf.text());
    }
    catch{
        err("\"config.json\"の記述が不正です。");
    }
    let wep = [];
    const wns = m => wep.push(m); //エラーダイアログの項目の追加関数
    if(wts.pagestruct == undefined) wns("pagestruct");
    if(wts.temp == undefined) wns("temp"); 
    if(wts.icon == undefined) {
        warn("config.jsonで設定\"icon\"が欠如しています。");
    }
    if(wts.plugin == undefined) {
        warn("config.jsonで設定\"plugin\"が欠如しています。");
    }
    if(wts.pagepath == undefined) wns("pagepath"); else{
        if(wts.pagepath.first == undefined) wns("pagepath.first");
        if(wts.pagepath.last == undefined) wns("pagepath.last");
    }
    
    if(wep.length != 0){
        let res = "\"" + wtsetting + "\"で以下の設定が欠如しています。\n";
        wep.forEach(e=>{
            res += e + "\n";
        });
        err(res);
    }
    path = wts.pagepath
    return wts;
}