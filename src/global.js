export const is_debug = false
export const err=msg=>{
    if(is_debug){
        alert("liblog.jsエラー：" + msg);
        throw msg;
    }else{
        alert("liblog.jsでエラーが発生しました。\n管理者に問い合わせてください。")
        throw undefined;
    }
}
export const warn=msg=>{
    if(is_debug){
        console.error("liblog.js警告："+msg)
    }
}
export let plugin = {
    text:[],
    component:[]
}
export let main_elm
export let path
export let notfound;
export const document = window.document
export let template