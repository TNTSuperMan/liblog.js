import { main_elm, document } from "./global"
import GenPage from "./genpage"
import { Config, Plugin, Template } from "type";
export default (id: string, config: Config, template: Template, plugin: Plugin)=>{ //ページ内移動
    history.replaceState('', '', "?p=" + id);
    fetch(config.path.first + id + config.path.last)
        .then(e=>e.ok ? e.text() : config.notfound)
        .then(e=>{
            document.documentElement.scrollTop = 0
            GenPage(e, main_elm, template, plugin, true);
        })
}