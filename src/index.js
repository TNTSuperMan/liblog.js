import LoadConfig from "./load/config.js";
import LoadPage from "./load/page.js";
import LoadPlugin from "./load/plugin.js";
import LoadTemplate from "./load/template.js";
import WriteCredit from "./credit.js";
import Redirect from "./redirect.js";
import GenPage from "./genpage.js";
import {err} from "./global.js";
(async()=>{
    WriteCredit()
    const config = await LoadConfig()
    const page = LoadPage(config)
    const plugin = LoadPlugin(config)
    const temp = LoadTemplate(config)
    await plugin;
    //#region ページ構築
    document.head.appendChild(document.createElement("title")); //タイトル要素
    Promise.all(page.text).then(ptxts=>
        page.elms.forEach((element,i)=>
            GenPage(ptxts[i],element,(page.ids[i]==="main"?1:0),temp)))
    .then(()=>{
        let get_arg = Object.fromEntries(new URLSearchParams(window.location.search));
        if(get_arg.s != undefined){
            document.documentElement.scrollTop += document.getElementById(get_arg.s).getBoundingClientRect().y;
    }});
    let si = document.createElement("link");
    let i = document.createElement("link");
    si.rel = "shortcut icon";
    i.rel = "icon";
    si.href = config.icon;
    i.href = config.icon;
    document.head.appendChild(si);
    document.head.appendChild(i);
    //#endregion
    window.l = Redirect;
})();