const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const packageInfo = require('../package.json');
const genCommonConfig = require('./webpack.common.config.js');

const rootDir = path.resolve(__dirname, '..');

module.exports = (env, argv) => {
    const commonWebpackConfig = genCommonConfig(argv);

    return merge(commonWebpackConfig, {
        mode: 'production',
        output: {
            publicPath: `/${packageInfo.name}`
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        chunks: 'initial',
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        name: 'vendor',
                        priority: 10,
                        enforce: true
                    }
                }
            },
            namedChunks: true,
            moduleIds: 'hashed',
            runtimeChunk: 'single'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(rootDir, 'static/index.ejs'),
                favicon: path.resolve(rootDir, 'static/favicon.ico'),
                inject: true,
                customVariable: {
                    urlBase: `/${packageInfo.name}`,
                    appName: packageInfo.name
                },
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: false
                }
            })
        ]
    });
};
