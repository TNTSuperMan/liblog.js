import {notfound,main_elm,path} from "./global"
import GenPage from "./genpage"
export default (id: string) => { //ページ内移動
    history.replaceState('','',"?p=" + id);
    fetch(path.first + id + path.last)
        .then(e=>e.ok?e.text():notfound)
        .then(e=>{
            document.documentElement.scrollTop=0
            GenPage(e,main_elm,true);
        })
}