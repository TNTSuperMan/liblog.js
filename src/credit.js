export default ()=>{
    let root = document.querySelector("html").getRootNode();
    root.prepend(document.createComment("https://github.com/TNTSuperMan/liblog.js"));
    root.prepend(document.createComment("Powered by liblog.js by TNTSuperMan."));

    console.log("%c Powered by Whxute.js by TNTSuperMan.", "font-size:20px");
    console.log("https://github.com/TNTSuperMan/liblog.js");
}