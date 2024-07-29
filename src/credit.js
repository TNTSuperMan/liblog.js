import {document} from "./global.js"
export default ()=>{
    const url = "https://github.com/TNTSuperMan/liblog.js"
    const by = "Powered by liblog.js by TNTSuperMan."
    const root = document.querySelector("html").getRootNode();
    root.prepend(document.createComment(url));
    root.prepend(document.createComment(by));

    console.log("%c "+by, "font-size:20px");
    console.log(url);
}