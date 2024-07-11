export function err(msg){
    alert("liblog.jsエラー：" + msg);
    throw msg;
}
export function warn(msg){
    console.error("liblog.js警告："+msg)
}
export let plugin = {
    text:[],
    component:[]
}
export let main_elm
export var path = {}
export const errpage = "404\n:p:404 Not Found\n" + 
    ":p:ページファイルが存在しません。";