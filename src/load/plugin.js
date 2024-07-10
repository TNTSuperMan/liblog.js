import {err,textplug} from "../global.js";
export default config =>{
    let plugdata_promise = [];
    config.plugin.forEach(e=>{
        plugdata_promise.push((async x=>{
            let ps = fetch(e + "/script.js");
            let pc = fetch(e + "/config.json");
            await Promise.all([ps,pc]);
            ps = await ps;
            pc = await pc;
            if(!ps.ok) {
                err("プラグインファイル \"" + e + "/script.js\"にアクセスできません。");
                return;
            }
            if(!pc.ok) {
                err("プラグイン設定ファイル \"" + e + "/config.json\"にアクセスできません。");
                return;
            }
            let pcjo;
            try {
                pcjo = JSON.parse(await pc.text())
            } catch (e) {
                err("プラグイン設定ファイル \"" + e + "/config.json\"の記述が不正です。");
                return;                
            }
            let rpd;
            try {
                rpd = await import(e + "/script.js");
            } catch (e) {
                err("プラグインファイル \"" + e + "/script.js\"の記述が不正です。");
                return;                
            }
            rpd.set(pcjo);
            switch(rpd.mode){
                case "text":
                    textplug = rpd;
                    break;
            }
        })())
    })
    return plugdata_promise
}