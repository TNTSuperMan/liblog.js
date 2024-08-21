import LoadConfig from "./load/config";
import LoadPage from "./load/page";
import LoadPlugin from "./load/plugin";
import LoadTemplate from "./load/template";
import WriteCredit from "./credit";
import Redirect from "./redirect";
import GenPage from "./genpage";
import { document, createElement, execDOM } from "./global"
import plugin from "./load/plugin";
(async()=>{
    WriteCredit()
    const config = await LoadConfig()
    const page = LoadPage(config)
    const template = LoadTemplate(config)
    const plugin = await LoadPlugin(config)

    execDOM(async()=>{
        document.head.appendChild(createElement("title")); //タイトル要素
        const pagetexts = await Promise.all(page.text)
        page.elms.forEach((element,i)=>
            GenPage(pagetexts[i], element, template, plugin, page.ids[i] == "main"))
    
        let scrollElement = document.getElementById(
            new URLSearchParams(window.location.search).get("s") ?? "");
        if(scrollElement){
            document.documentElement.scrollTop += scrollElement.getBoundingClientRect().y;
        }
    })
    
    
    Object.defineProperty(window,"l",{get:()=>(id:string)=>Redirect(id, config, template, plugin)})
})();