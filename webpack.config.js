const Path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

const defaults = {
    entry: './src/Base.ts',
    devtool: 'source-map',
    node: {
        fs: 'empty',
        child_process: 'empty'
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

module.exports = [
    Object.assign(
        {
            target: 'web',
            output: {
                filename: 'Bitclave-Base.Web.js',
                library: 'BitclaveBase',
                path: Path.resolve(__dirname, 'dist'),
                libraryTarget: "umd2",
                umdNamedDefine: true
            },
        },
        defaults
    ),
    Object.assign(
        {
            target: 'node',
            output: {
                filename: 'Bitclave-Base.Node.js',
                library: 'Bitclave-Base',
                path: Path.resolve(__dirname, 'dist'),
                libraryTarget: "umd2",
                umdNamedDefine: true
            },
        },
        defaults
    ),
];
