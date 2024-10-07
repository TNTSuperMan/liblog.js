import { document, execDOM } from "./global"
export default ()=>{
    const url = "https://github.com/TNTSuperMan/liblog.js"
    const by = "Powered by liblog.js by TNTSuperMan."
    execDOM(()=>{
        const html = document.querySelector("html")
        if(html){
            const root = html.parentNode
            if(root){
                root.prepend(document.createComment(url));
                root.prepend(document.createComment(by));
            }
        }
    })
    
    console.log("%c "+by, "font-size:20px");
    console.log(url);
}