import {err,plugin,warn} from "../global.js";
export default async config =>{
    const plugprom = config.plugin.map(e=>
        import(/*webpackIgnore:true*/e).then(async plugdata=>{
            if(typeof plugdata.func != "function"){
                err("プラグインファイル\""+e+"\"でfunc関数が不足しています。")
            }else if(typeof plugdata.mode != "string"){
                err("プラグインファイル\""+e+"\"でmode変数が不足しています。")
            }else if(typeof plugdata.name != "string"){
                err("プラグインファイル\""+e+"\"でname変数が不足しています。")
            }
            let mode_is_vaild = true
            switch(plugdata.mode){
                case "text":
                    plugin.text.push(plugdata.func)
                    break;
                case "component":
                    plugin.component.push([plugdata.func,plugdata.name])
                    break;
                default:
                    mode_is_vaild = false
                    warn("プラグインファイル\""+e+"\"のmode変数が不正です。")
                    break;
            }
            if(mode_is_vaild){
                if(typeof plugdata.init !== "function"){
                    warn("プラグインファイル\""+e+"\"でinit関数が不足しています。")
                }else{
                    const initres = plugdata.init()
                    if(initres instanceof Promise) await initres
                }
            }
        }))
    await Promise.all(plugprom)
    return
}