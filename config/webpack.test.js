
const path = require("path");
const webpack = require("webpack");
const { merge } = require('webpack-merge');
const common = require("./webpack.common.js");
const config = require("./config");


module.exports = function (env) {
    return merge(common, {
        devtool: 'source-map',
        mode: "production",        
        output: {        
            path: path.resolve(__dirname, "C:\\Users\\cwaldmann\\source\\Deploy\\Overruled\\Test\\Client")
        }, 
        plugins: [ new webpack.DefinePlugin(config.getEnvironmentVariables("test")) ]
    });
};

