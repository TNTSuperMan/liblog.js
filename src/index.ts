import LoadConfig from "./load/config";
import LoadPage from "./load/page";
import LoadPlugin from "./load/plugin";
import LoadTemplate from "./load/template";
import WriteCredit from "./credit";
import Redirect from "./redirect";
import GenPage from "./genpage";
import {document} from "./global"
(async()=>{
    WriteCredit()
    const config = await LoadConfig()
    const page = LoadPage(config)
    const plugin = LoadPlugin(config)
    const temp = LoadTemplate(config)
    //#region ページ構築
    document.head.appendChild(document.createElement("title")); //タイトル要素
    await plugin;
    Promise.all(page.text).then(ptxts=>
        page.elms.forEach((element,i)=>
            GenPage(ptxts[i],element,page.ids[i]==="main")))
    .then(()=>{
        let get_arg = Object.fromEntries(new URLSearchParams(window.location.search));
        if(typeof get_arg.s != "undefined"){
            let scrollElement = document.getElementById(get_arg.s)
            if(scrollElement){
                document.documentElement.scrollTop += scrollElement.getBoundingClientRect().y;
            }
            
        }
    });
    //#endregion
    Object.defineProperty(window,"l",{get:()=>Redirect})
})();