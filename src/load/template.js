import {err,template} from "../global.js"
export default config =>{
    let ret = {base:[],name:[]};
    try{
        config.temp.forEach(e=>{ret.base.push(e.base);ret.name.push(e.name)});
    }
    catch{
        err("テンプレートの記述が不正です");
    }
    template = ret
    return ret;
}