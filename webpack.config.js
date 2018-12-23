const Path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
    entry: './src/Base.ts',
    devtool: 'source-map',
    node: {
        fs: 'empty',
        child_process: 'empty',
        __dirname: false,
        __filename: false
    },
    target: 'node',
    externals: {
        'bitcore-ecies': 'bitcore-ecies',
        'bitcore-lib': 'bitcore-lib',
        'bitcore-message': 'bitcore-message',
        'bitcore-mnemonic': 'bitcore-mnemonic'
    },
    module: {
        loaders: [
            {test: /\.ts(x?)$/, loader: "babel-loader?presets[]=preset-env!ts-loader"}
        ],
        rules: [
            {
                test: /\.ts(x?)$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: [Path.resolve('./node_modules'), Path.resolve('./src')],
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'Bitclave-Base.js',
        path: Path.resolve(__dirname, 'dist'),
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
