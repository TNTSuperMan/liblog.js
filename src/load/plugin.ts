import { Config } from "type";
import {plugin,warn} from "../global";
export default async (config:Config) =>{
    if(config.plugin){
        const plugprom: Promise<void>[] = config.plugin?.map(e=>
            import(/*webpackIgnore:true*/e).then(async (plugdata: {
                func?: Function,
                mode?: string,
                name?: string,
                init?: Function
            })=>{
                if(typeof plugdata.func != "function"){
                    warn("プラグインファイル\""+e+"\"でfunc関数が不足しています。")
                }else if(typeof plugdata.mode != "string"){
                    warn("プラグインファイル\""+e+"\"でmode変数が不足しています。")
                }else if(typeof plugdata.name != "string"){
                    warn("プラグインファイル\""+e+"\"でname変数が不足しています。")
                }else{
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
                }
            }))
        await Promise.all(plugprom)
    }
}