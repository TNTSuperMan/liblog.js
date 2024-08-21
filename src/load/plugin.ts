import { Config, Plugin } from "type";
import { warn, is_debug } from "../global";
export default async (config: Config) =>{
    let plugin: Plugin = {
        text:[],
        component:[]
    }
    if(config.plugin){
        const plugprom: Promise<void>[] = config.plugin?.map(e=>
            import(/*webpackIgnore:true*/e).then(async (plugdata: {
                func: Function,
                mode: string,
                name: string,
                init: Function
            })=>{
                if(is_debug){
                    if(typeof plugdata.func != "function"){
                        warn("プラグインファイル\""+e+"\"でfunc関数が不足しています。")
                    }else if(typeof plugdata.mode != "string"){
                        warn("プラグインファイル\""+e+"\"でmode変数が不足しています。")
                    }else if(typeof plugdata.name != "string"){
                        warn("プラグインファイル\""+e+"\"でname変数が不足しています。")
                    }
                }
                let is_mode_valid = true
                switch(plugdata.mode){
                    case "text":
                        plugin.text.push(plugdata.func)
                        break;
                    case "component":
                        plugin.component.push([plugdata.func,plugdata.name])
                        break;
                    default:
                        is_mode_valid = false
                        warn("プラグインファイル\""+e+"\"のmode変数が不正です。")
                        break;
                }
                if(is_mode_valid){
                    if(typeof plugdata.init !== "function"){
                        warn("プラグインファイル\""+e+"\"でinit関数が不足しています。")
                    }else{
                        const initres = plugdata.init()
                        if(initres instanceof Promise) await initres
                    }
                }
            }))
        await Promise.all(plugprom)
    }
    return plugin
}