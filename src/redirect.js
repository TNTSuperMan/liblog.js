import {errpage,main_elm,path,template} from "./global.js"
import GenPage from "./genpage.js"
export default id => { //ページ内移動
    history.replaceState('','',"?p=" + id);
    fetch(path.first + id + path.last)
        .then(e=>e.ok?e.text():errpage)
        .then(e=>GenPage(e,main_elm,true))   
}