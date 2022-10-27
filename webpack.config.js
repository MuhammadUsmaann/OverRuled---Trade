const path = require('path');

module.exports = (env) => {
    // Use env.<YOUR VARIABLE> here:
    console.log('Environment: ', env.target); // 'local'

    return require("./config/webpack." + env.target + ".js")(env.target); 

};

//module.exports = (env) => {
//    //// Use env.<YOUR VARIABLE> here:
//    //console.log('Goal: ', env.goal); // 'local'
//    //console.log('Production: ', env.production); // true
//    console.log("ENV: " + Object.keys(env)[0]);

//    //return require("./config/webpack." + Object.keys(env)[0] + ".js")(env); 
//    return require("./config/webpack.dev.js")(env); 

//};



//function buildConfig(mode) {
//    console.log(mode);
//    return require("./config/webpack." + Object.keys(mode)[0] + ".js")(mode); 
//}

//module.exports = buildConfig;