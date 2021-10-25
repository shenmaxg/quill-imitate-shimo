const path = require('path');
const webpack = require('webpack');
const autoPreFixer = require('autoprefixer');

const rootDir = path.resolve(__dirname, '..');

module.exports = (argv) => {
    const { ENV = 'pro' } = argv;

    /* eslint-disable-next-line */
    const configFile = require(`../env/env.${ENV}.json`);

    return {
        entry: {
            app: path.join(rootDir, 'src/index.tsx')
        },
        output: {
            path: path.resolve(rootDir, 'dist'),
            filename: 'src/js/[name]-[hash].js',
            chunkFilename: 'src/js/[name]-[chunkhash].js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    ident: 'postcss',
                                    plugins: [autoPreFixer()]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    auto: (resourcePath) => resourcePath.indexOf('node_modules') === -1,
                                    localIdentName: '[name]_[local]-[hash:base64:6]'
                                },
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    ident: 'postcss',
                                    plugins: [autoPreFixer()]
                                }
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(jpg|png|eot|[ot]tf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: '5120',
                                name: 'pic/[hash:8].[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: [{
                        loader: 'raw-loader'
                    }]
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        plugins: [
            new webpack.DefinePlugin({
                ENV_CONFIG: JSON.stringify(configFile),
                ENV: JSON.stringify(ENV)
            })
        ]
    };
};
