const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

//const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        index: "./src/js/view/index/index.js",
        cases: "./src/js/view/cases/index.js",
        calculator: "./src/js/view/caclulator/index.js",
        secondary: "./src/js/view/secondary/index.js",
        guidance: "./src/js/view/guidance/index.js",
        heatmaps: "./src/js/view/heatmaps/index.js",
        regulatoryinsights: "./src/js/view/regulatoryinsights/index.js",
        search: "./src/js/view/search/index.js"

    },
    output: {
        path: path.resolve("./dist"),
        filename: "js/[name].js"
    },
    module: {
        rules: [
            // Bundle resource files
            {
                test: /(\.jpg|\.png|\.gif|\.svg|\.ico)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: path.resolve(__dirname, 'img'),
                        outputPath: 'img',
                        name: '[name].[ext]',
                        esModule: true
                    }
                }],
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: path.resolve(__dirname, 'fonts'),
                        outputPath: 'fonts',
                        name: '[name].[ext]',
                        esModule: false
                    }
                }],
            },

            //{
            //    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
            //    use: [
            //        {
            //            loader: 'url-loader',
            //            options: {
            //                limit: 10000,
            //                name: './fonts/[hash].[ext]',
            //                mimetype: 'application/font-woff'
            //            }
            //        }
            //    ]
            //},
            // Bundle stylesheets
            //{
            //    test: /\.(s*)css$/,
            //    use: ExtractTextPlugin.extract({
            //        fallback: 'style-loader',
            //        use: ['css-loader', 'sass-loader']
            //    })
            //},

            {
                test: /\.css$/,
                use: [
                    //MiniCssExtractPlugin.loader,
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false,
                        }
                    }
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    //MiniCssExtractPlugin.loader,
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
                use: ["source-map-loader"]
            },
            {
                test: /\.html$/i,
                use: [{
                    loader: 'html-loader',
                    options: {
                        esModule: true
                    }
                }],
            },
            //{
            //    test: /\.js$/,
            //    exclude: /node_modules/,
            //    use: {
            //        loader: 'babel-loader',
            //        options: {
            //            presets: ['@babel/preset-env'],
            //            cacheDirectory: true
            //        }
            //    }
            //}
        ]
    },
    plugins: [
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: "./src/html"
                    },
                    {
                        from: "./src/rsc",
                        to: "./rsc",
                    },
                    {
                        from: "./src/img",
                        to: "./img",
                    },
                    {
                        from: "./src/img/territories",
                        to: "./img/territories",
                    },
                ],
            }

        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.ProvidePlugin({
            _: "lodash"
        }),
        new webpack.ProvidePlugin({ Cookies: 'js-cookie/src/js.cookie.js' }),
        //new MiniCssExtractPlugin(),

    ]
};

