const webpack = require("webpack");
const { merge } = require('webpack-merge');
const common = require("./webpack.common.js");
const config = require("./config");

module.exports = function(env) {
    return merge(common, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            historyApiFallback: {
                index: "index.html"            
            },
            hot: true,
            port: 8080
        }, 
        plugins: [ new webpack.DefinePlugin(config.getEnvironmentVariables("dev")) ]
    });
}; 