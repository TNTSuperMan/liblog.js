export default config =>{
    let ret = {base:[],name:[]};
    try{
        config.temp.forEach(e=>{ret.base.push(e.base);ret.name.push(e.name)});
    }
    catch{
        return 404;
    }
    return ret;
}