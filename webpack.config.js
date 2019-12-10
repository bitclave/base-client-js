const Path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const DeepMerge = require('deep-merge');
const TSLintPlugin = require('tslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const DeepCopy = DeepMerge((target, source, key) => {
    if (target instanceof Array) {
        return [].concat(target, source);
    }
    return source;
});

const nodeConfig = {
    entry: './src/Base.ts',
    devtool: 'source-map',
    mode: 'production',
    node: {
        crypto: true,
        Buffer: true,
        fs: 'empty',
        child_process: 'empty'
    },
    target: 'node',
    // externals: {
    //     'bitcore-ecies': 'bitcore-ecies',
    //     'bitcore-lib': 'bitcore-lib',
    //     'bitcore-message': 'bitcore-message',
    //     'bitcore-mnemonic': 'bitcore-mnemonic'
    // },
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
            },
        ]
    },

    resolve: {
        // https://github.com/typestack/class-validator/pull/258
        alias: {
            'google-libphonenumber': Path.resolve(__dirname, './src/libphonenumber-stub.js'),
        },
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
        // new BundleAnalyzerPlugin(),
        new TSLintPlugin({
            waitForLinting: true,
            warningsAsError: true,
            config: './tslint.json',
            files: ['./src/**/*.ts', "./test/**/*.ts"]
        }),
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
