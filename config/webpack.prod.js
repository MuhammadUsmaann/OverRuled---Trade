const webpack = require("webpack");
const path = require("path");
const { merge } = require('webpack-merge');
const common = require("./webpack.common.js");
const config = require("./config");

module.exports = function(env) {
    
    return  merge(common, {
        mode: "production",        
        output: {        
            path: path.resolve(__dirname, "C:\\Users\\cwaldmann\\source\\Deploy\\Overruled\\Prod\\Client")
        },
        plugins: [ new webpack.DefinePlugin(config.getEnvironmentVariables("prod")) ]
    });
};

