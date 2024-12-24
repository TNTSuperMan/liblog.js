import path from "path"
export default {
    entry: path.resolve(import.meta.dirname, "src", "index.ts"),
    output: {
        filename: "main.js",
        path: path.resolve(import.meta.dirname, "dist")
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
}