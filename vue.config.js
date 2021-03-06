const path = require("path");
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
    publicPath: IS_PROD ? "https://gof.oss-accelerate.aliyuncs.com/prod/golff/" : "/",
    lintOnSave: false,
    runtimeCompiler: true,
    productionSourceMap: false,
    pwa: {},
    devServer: {
        open: true,
        host: "localhost",
        port: '8061',
        https: false,
        hotOnly: false,
        proxy: {
            '/golff-server': {
                target: 'https://golff.com/',
                ws: true,
                changeOrigin: true,
            }
        },
    },
    configureWebpack: config => {
        const plugins = [];
        if (IS_PROD) {
            plugins.push(
                new TerserJsPlugin({
                    terserOptions: {
                        warnings: false,
                        output: {
                            comments: false
                        },
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log']
                        }
                    },
                    sourceMap: false,
                    parallel: true
                }),
                new CompressionWebpackPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                }),
                new FileManagerPlugin({
                    onEnd: {
                        archive: [
                            { source: './dist', destination: './golff.zip' }
                        ],
                        delete: [
                            './dist'
                        ]
                    }
                })
            );
        }
        config.plugins = [...config.plugins, ...plugins];
    }
}
