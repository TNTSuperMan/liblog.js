import { Config, PluginData } from "type";
import { warn, is_debug } from "../global";

type TextPlugin = {
    func: ((e: string[]) => string[])
    mode: "text",
    name: string,
    init: () => void | Promise<void>
}
type ComponentPlugin = {
    func: (text: string[], e: (e: HTMLElement) => HTMLElement) => HTMLElement,
    mode: "component",
    name: string,
    init: () => void | Promise<void>
}
type Plugin = TextPlugin | ComponentPlugin;

export default async (config: Config)=>{
    const plugin: PluginData = {
        text:[],
        component:[]
    }
    if(config.plugin){
        const plugprom: Promise<void>[] = config.plugin?.map(e=>
            import(/*webpackIgnore:true*/e).then(async (plugdata: Plugin)=>{
                if(is_debug){
                    if(typeof plugdata.func != "function"){
                        warn("プラグインファイル\""+e+"\"でfunc関数が不足しています。")
                    }else if(typeof plugdata.mode != "string"){
                        warn("プラグインファイル\""+e+"\"でmode変数が不足しています。")
                    }else if(typeof plugdata.name != "string"){
                        warn("プラグインファイル\""+e+"\"でname変数が不足しています。")
                    }
                }
                switch(plugdata.mode){
                    case "text":
                        plugin.text.push(plugdata.func)
                        break;
                    case "component":
                        plugin.component.push([plugdata.func,plugdata.name])
                        break;
                    default:
                        warn("プラグインファイル\""+e+"\"のmode変数が不正です。")
                        return;
                }
                if(is_debug && typeof plugdata.init != "function"){
                    warn("プラグインファイル\""+e+"\"でinit関数が不足しています。")
                }else{
                    const initres = plugdata.init()
                    if(initres instanceof Promise) await initres
                }
            }))
        await Promise.all(plugprom)
    }
    return plugin
}