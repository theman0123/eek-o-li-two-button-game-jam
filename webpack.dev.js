"use strict";

const webpack = require("webpack");
const merge = require("webpack-merge");
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common.js");
const colors = require("colors/safe");
const version = require("./package.json").version;
const Matter = require("matter-attractors");

const portfinder = require("portfinder");
portfinder.basePort = 4000;

portfinder.getPort(function(err, finalPort) {
    if (err) {
        callback(err);
    }
    const compiler = webpack(
        merge(common, {
            entry: {
                game: [
                    // Live-reload
                    `webpack-dev-server/client?http://localhost:${finalPort}`,
                ],
            },
            devtool: "source-map",
            mode: "development",
            plugins: [
                new webpack.DefinePlugin({
                    // Enable both canvas and WebGL for better support
                    "typeof CANVAS_RENDERER": JSON.stringify(true),
                    "typeof WEBGL_RENDERER": JSON.stringify(true),
                    "typeof EXPERIMENTAL": JSON.stringify(false),
                    "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
                    "typeof PLUGIN_FBINSTANT": JSON.stringify(false),

                    // Development env
                    _DEV_: JSON.stringify(true),
                    _VERSION_: JSON.stringify(version),
                }),
                new HtmlWebpackPlugin({
                    template: "index.html",
                    inject: "body",
                }),
                // Matter.use("matter-gravity", "matter-world-wrap"),
            ],
        }),
    );
    const server = new WebpackDevServer(compiler, {
        stats: {
            colors: true,
        },
    });
    server.listen(finalPort, null, function() {
        console.log(
            `Project is running at: ${colors.bold(
                colors.blue("http://localhost:" + finalPort),
            )}`,
        );
    });
});
