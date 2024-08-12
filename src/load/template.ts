import {err,setTemplate} from "../global"
import {Config, Template} from "../type"
export default (config: Config) =>{
    let ret: Template = {base:[],name:[]};
    try{
        config.temp?.forEach(e=>{ret.base.push(e.base);ret.name.push(e.name)});
    }
    catch{
        err("テンプレートの記述が不正です");
    }
    setTemplate(ret)
    return ret;
}