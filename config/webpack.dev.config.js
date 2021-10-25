const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const genCommonConfig = require('./webpack.common.config.js');
const packageInfo = require('../package.json');

const rootDir = path.resolve(__dirname, '..');

module.exports = (env, argv) => {
    const commonWebpackConfig = genCommonConfig(argv);

    return merge(commonWebpackConfig, {
        mode: 'development',
        output: {
            publicPath: '/'
        },
        devtool: 'eval-source-map',
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(rootDir, 'static/index.ejs'),
                favicon: path.resolve(rootDir, 'static/favicon.ico'),
                inject: true,
                customVariable: {
                    urlBase: '/',
                    appName: packageInfo.name
                }
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        devServer: {
            hot: true,
            compress: true,
            port: 3000,
            stats: {
                colors: true,
                cached: false,
                cachedAssets: false
            }
        }
    });
};
