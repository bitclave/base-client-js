const Path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
    entry: './lib/Base.js',
    target: 'node',
    output: {
        filename: 'Bitclave-Base.js',
        path: Path.resolve(__dirname, Path.resolve('./lib')),
        library: 'Bitclave-Base',
        libraryTarget: "umd2",
        umdNamedDefine: true
    },
    plugins: [
        new TypedocWebpackPlugin({
            out: './docs',
            module: 'commonjs',
            target: 'es6',
            exclude: '**/node_modules/**/*.*',
            excludePrivate: true,
            experimentalDecorators: true,
            excludeExternals: true
        }, './src/')
    ]
};
