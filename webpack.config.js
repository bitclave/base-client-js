const Path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const DeepMerge = require('deep-merge');

const DeepCopy = DeepMerge((target, source, key) => {
    if (target instanceof Array) {
        return [].concat(target, source);
    }
    return source;
});

const nodeConfig = {
    entry: './src/Base.ts',
    devtool: 'source-map',
    node: {
        fs: 'empty',
        child_process: 'empty'
    },
    target: 'node',
    externals: {
        'bitcore-ecies': 'bitcore-ecies',
        'bitcore-lib': 'bitcore-lib',
        'bitcore-message': 'bitcore-message',
        'bitcore-mnemonic': 'bitcore-mnemonic'
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {loader: 'babel-loader'},
                    {loader: 'ts-loader'},
                    {loader: Path.join(__dirname, "./LogLoader.js")}
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: [Path.resolve('./node_modules'), Path.resolve('./src')],
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'Base.node.js',
        path: Path.resolve(__dirname, 'dist'),
        library: 'Base',
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

const browserConfig = DeepCopy(
    nodeConfig,
    {
        target: 'web',
        node: {
            fs: 'empty',
            tls: 'empty',
            net: 'empty',
            child_process: 'empty'
        },
        output: {
            filename: 'Base.js',
            path: Path.resolve(__dirname, 'dist'),
            library: 'Base',
            libraryTarget: "umd2",
            umdNamedDefine: true
        },
    }
);

module.exports = [browserConfig, nodeConfig];
