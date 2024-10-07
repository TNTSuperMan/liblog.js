import { warn } from "../global"
import { Config, Template } from "../type"
export default (config: Config)=>{
    const ret: Template = {base:[],name:[]};
    try{
        if(config.temp) config.temp.forEach(e=>{ret.base.push(e.base);ret.name.push(e.name)});
    }
    catch{
        warn("テンプレートの記述が不正です");
    }
    return ret
}